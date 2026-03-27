package com.codeverge.talentportal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class StudentSchemaCompatibilityConfig implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        if (!studentsTableExists()) {
            return;
        }

        Set<String> columns = getStudentsColumns();

        ensureColumn(columns, "first_name", "VARCHAR(50)", "firstName", "firstname");
        ensureColumn(columns, "last_name", "VARCHAR(50)", "lastName", "lastname");
        ensureColumn(columns, "phone_number", "VARCHAR(20)", "phone", "phonenumber");
        ensureColumn(columns, "year_of_study", "VARCHAR(50)", "year", "yearofstudy");
        ensureColumn(columns, "created_at", "DATETIME", "createdAt", "createdat");
    }

    private boolean studentsTableExists() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'students'",
                Integer.class
        );
        return count != null && count > 0;
    }

    private Set<String> getStudentsColumns() {
        List<String> columns = jdbcTemplate.query(
                "SHOW COLUMNS FROM students",
                (rs, rowNum) -> rs.getString("Field").toLowerCase(Locale.ROOT)
        );
        return columns.stream().collect(Collectors.toSet());
    }

    private void ensureColumn(Set<String> existingColumns, String targetColumn, String type, String... sourceCandidates) {
        if (existingColumns.contains(targetColumn.toLowerCase(Locale.ROOT))) {
            return;
        }

        jdbcTemplate.execute("ALTER TABLE students ADD COLUMN `" + targetColumn + "` " + type + " NULL");

        String sourceColumn = findFirstAvailableColumn(existingColumns, sourceCandidates);
        if (sourceColumn != null) {
            jdbcTemplate.execute(
                    "UPDATE students SET `" + targetColumn + "` = `" + sourceColumn + "` " +
                    "WHERE `" + targetColumn + "` IS NULL"
            );
        } else if ("created_at".equals(targetColumn)) {
            jdbcTemplate.execute(
                    "UPDATE students SET `" + targetColumn + "` = NOW() WHERE `" + targetColumn + "` IS NULL"
            );
        }

        existingColumns.add(targetColumn.toLowerCase(Locale.ROOT));
    }

    private String findFirstAvailableColumn(Set<String> existingColumns, String... candidates) {
        for (String candidate : candidates) {
            String normalized = candidate.toLowerCase(Locale.ROOT);
            if (existingColumns.contains(normalized)) {
                return candidate;
            }
        }
        return null;
    }
}

package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.TechnicalQuestion;
import com.codeverge.talentportal.repository.TechnicalQuestionRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class TechnicalQuestionService {
    
    @Autowired
    private TechnicalQuestionRepository technicalQuestionRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public List<TechnicalQuestion> getAllQuestions() {
        return technicalQuestionRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Optional<TechnicalQuestion> getQuestionById(Long id) {
        return technicalQuestionRepository.findById(id);
    }
    
    public TechnicalQuestion createQuestion(TechnicalQuestion question) {
        LocalDateTime now = LocalDateTime.now();
        question.setCreatedAt(now);
        question.setUpdatedAt(now);

        Set<String> columns = getColumns();
        List<String> insertColumns = new ArrayList<>();
        List<Object> insertValues = new ArrayList<>();

        addInsertIfPresent(columns, insertColumns, insertValues, "question", question.getQuestion());
        addInsertIfPresent(columns, insertColumns, insertValues, "optiona", question.getOptionA());
        addInsertIfPresent(columns, insertColumns, insertValues, "optionb", question.getOptionB());
        addInsertIfPresent(columns, insertColumns, insertValues, "optionc", question.getOptionC());
        addInsertIfPresent(columns, insertColumns, insertValues, "optiond", question.getOptionD());
        addInsertIfPresent(columns, insertColumns, insertValues, "correct_answer", question.getCorrectAnswer());
        addInsertIfPresent(columns, insertColumns, insertValues, "category", question.getCategory());
        addInsertIfPresent(columns, insertColumns, insertValues, "difficulty", question.getDifficulty());
        addInsertIfPresent(columns, insertColumns, insertValues, "created_at", now);
        addInsertIfPresent(columns, insertColumns, insertValues, "updated_at", now);

        String placeholders = String.join(", ", insertColumns.stream().map(c -> "?").toList());
        String sql = "INSERT INTO technical_questions (" + String.join(", ", insertColumns) + ") VALUES (" + placeholders + ")";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var ps = connection.prepareStatement(sql, new String[]{"id"});
            for (int i = 0; i < insertValues.size(); i++) {
                ps.setObject(i + 1, insertValues.get(i));
            }
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            Long id = key.longValue();
            return technicalQuestionRepository.findById(id).orElseGet(() -> {
                question.setId(id);
                return question;
            });
        }
        return question;
    }
    
    public TechnicalQuestion updateQuestion(Long id, TechnicalQuestion questionDetails) {
        Optional<TechnicalQuestion> questionOpt = technicalQuestionRepository.findById(id);
        if (questionOpt.isPresent()) {
            TechnicalQuestion question = questionOpt.get();
            question.setQuestion(questionDetails.getQuestion());
            question.setOptionA(questionDetails.getOptionA());
            question.setOptionB(questionDetails.getOptionB());
            question.setOptionC(questionDetails.getOptionC());
            question.setOptionD(questionDetails.getOptionD());
            question.setCorrectAnswer(questionDetails.getCorrectAnswer());
            question.setCategory(questionDetails.getCategory());
            question.setDifficulty(questionDetails.getDifficulty());
            question.setUpdatedAt(LocalDateTime.now());

            Set<String> columns = getColumns();
            List<String> assignments = new ArrayList<>();
            List<Object> values = new ArrayList<>();

            addUpdateIfPresent(columns, assignments, values, "question", question.getQuestion());
            addUpdateIfPresent(columns, assignments, values, "optiona", question.getOptionA());
            addUpdateIfPresent(columns, assignments, values, "optionb", question.getOptionB());
            addUpdateIfPresent(columns, assignments, values, "optionc", question.getOptionC());
            addUpdateIfPresent(columns, assignments, values, "optiond", question.getOptionD());
            addUpdateIfPresent(columns, assignments, values, "correct_answer", question.getCorrectAnswer());
            addUpdateIfPresent(columns, assignments, values, "category", question.getCategory());
            addUpdateIfPresent(columns, assignments, values, "difficulty", question.getDifficulty());
            addUpdateIfPresent(columns, assignments, values, "updated_at", question.getUpdatedAt());

            String sql = "UPDATE technical_questions SET " + String.join(", ", assignments) + " WHERE id=?";
            values.add(id);
            jdbcTemplate.update(sql, values.toArray());

            return technicalQuestionRepository.findById(id).orElse(question);
        }
        return null;
    }
    
    public boolean deleteQuestion(Long id) {
        if (technicalQuestionRepository.existsById(id)) {
            technicalQuestionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<TechnicalQuestion> getQuestionsByCategory(String category) {
        return technicalQuestionRepository.findByCategoryOrderByCreatedAtDesc(category);
    }
    
    public List<TechnicalQuestion> getQuestionsByDifficulty(String difficulty) {
        return technicalQuestionRepository.findByDifficulty(difficulty);
    }
    
    private Set<String> getColumns() {
        List<String> cols = jdbcTemplate.query(
                "SHOW COLUMNS FROM technical_questions",
                (rs, rowNum) -> rs.getString("Field").toLowerCase()
        );
        return new LinkedHashSet<>(cols);
    }

    private void addInsertIfPresent(Set<String> availableCols, List<String> insertCols, List<Object> insertVals, String col, Object value) {
        if (availableCols.contains(col.toLowerCase())) {
            insertCols.add(col);
            insertVals.add(value);
        }
    }

    private void addUpdateIfPresent(Set<String> availableCols, List<String> assignments, List<Object> values, String col, Object value) {
        if (availableCols.contains(col.toLowerCase())) {
            assignments.add(col + "=?");
            values.add(value);
        }
    }
}

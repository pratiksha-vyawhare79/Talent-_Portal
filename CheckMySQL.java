import java.sql.*;

public class CheckMySQL {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/codeverge_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String username = "riso_user";
        String password = "123456";
        
        try {
            System.out.println("Testing MySQL connection...");
            Connection conn = DriverManager.getConnection(url, username, password);
            System.out.println("✅ MySQL connection successful!");
            
            // Check if table exists
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet tables = meta.getTables(null, null, "technical_test_results", new String[] {"TABLE"});
            if (tables.next()) {
                System.out.println("✅ technical_test_results table exists");
            } else {
                System.out.println("❌ technical_test_results table does not exist");
            }
            
            conn.close();
        } catch (SQLException e) {
            System.out.println("❌ MySQL connection failed:");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

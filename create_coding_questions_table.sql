-- Create coding_questions table for storing coding questions
CREATE TABLE IF NOT EXISTS coding_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type ENUM('algorithm', 'data_structure', 'problem_solving', 'coding_challenge') NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL,
    programming_language ENUM('javascript', 'python', 'java', 'cpp', 'c', 'csharp') NOT NULL,
    time_limit_minutes INT NOT NULL DEFAULT 30,
    sample_input TEXT,
    expected_output TEXT,
    constraints TEXT,
    hints TEXT,
    solution_code TEXT,
    test_cases JSON,
    points INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_language (programming_language),
    INDEX idx_type (question_type),
    INDEX idx_active (is_active)
);

-- Insert sample coding questions
INSERT INTO coding_questions (question_text, question_type, difficulty_level, programming_language, time_limit_minutes, sample_input, expected_output, constraints, hints, solution_code, test_cases, points, created_by) VALUES
('Write a function that finds the maximum subarray sum', 'algorithm', 'medium', 'javascript', 45, 
'[-2,1,-3,4,-1,2,1,-5,4]', '6', 
'Array length between 1 and 10^5, elements between -10^9 and 10^9', 
'Use Kadane''s algorithm or sliding window approach', 
'function maxSubArray(nums) { let maxSum = -Infinity; let currentSum = 0; for (let num of nums) { currentSum = Math.max(num, currentSum + num); maxSum = Math.max(maxSum, currentSum); } return maxSum; }',
'[{"input":[-2,1,-3,4,-1,2,1,-5,4],"output":6},{"input":[1,2,3,4,5],"output":15}]', 20, 'admin'),

('Implement a binary search tree', 'data_structure', 'hard', 'java', 60, 
'[5,3,7,2,4,null,6,8]', 
'Valid BST with proper left/right child relationships', 
'Start with root node, recursively build left/right subtrees, handle null values', 
'class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } } class BST { TreeNode root; public TreeNode insert(int val) { root = insertRec(root, val); return root; } private TreeNode insertRec(TreeNode root, int val) { if (root == null) return new TreeNode(val); if (val < root.val) root.left = insertRec(root.left, val); else root.right = insertRec(root.right, val); return root; } }',
'[{"tree":[5,3,7,2,4,null,6,8],"inorder":[2,3,4,5,6,7,8],"search":true},{"tree":[1,2,3],"inorder":[1,2,3],"search":false}]', 30, 'admin'),

('Solve the two-sum problem', 'problem_solving', 'easy', 'python', 30, 
'[2,7,11,15]', '9', 
'Exactly two indices that sum to target, indices must be different', 
'Use hash map or two-pointer technique', 
'def two_sum(nums, target): seen = {}; for i, num in enumerate(nums): complement = target - num; if complement in seen: return [seen[complement], i]; seen[num] = i; return []',
'[{"nums":[2,7,11,15],"target":9,"output":[0,1]},{"nums":[3,2,4],"target":6,"output":[1,2]}]', 15, 'admin'),

('Design a linked list with add/remove operations', 'coding_challenge', 'medium', 'cpp', 40, 
'Empty list initially', 
'O(1) for add, O(1) for remove, maintain head pointer', 
'class Node { public: int data; Node* next; Node(int x) : data(x), next(nullptr) {} }; class LinkedList { private: Node* head; public: LinkedList() : head(nullptr) {} void add(int data) { Node* newNode = new Node(data); if (!head) { head = newNode; return; } Node* temp = head; while (temp->next) temp = temp->next; temp->next = newNode; } void remove(int data) { if (!head) return; Node** temp = &head; while (*temp && (*temp)->data != data) temp = &(*temp)->next; if (*temp) { Node* toDelete = *temp; *temp = toDelete->next; delete toDelete; } } }',
'[{"operations":["add",5,"remove",3,"add",10,"remove",10],"final":[5,10]}]', 25, 'admin');

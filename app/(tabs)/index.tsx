import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a todo item');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => todo.id !== id))
        }
      ]
    );
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    if (completedCount === 0) {
      Alert.alert('Info', 'No completed todos to clear');
      return;
    }

    Alert.alert(
      'Clear Completed',
      `Delete ${completedCount} completed todo(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => !todo.completed))
        }
      ]
    );
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <ThemedView style={[styles.todoItem, item.completed && styles.completedTodo]}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => toggleTodo(item.id)}
      >
        <Ionicons 
          name={item.completed ? "checkbox" : "square-outline"} 
          size={24} 
          color={item.completed ? "#4CAF50" : "#666"} 
        />
      </TouchableOpacity>
      
      <Text style={[
        styles.todoText, 
        item.completed && styles.completedText
      ]}>
        {item.text}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </ThemedView>
  );

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Todo App</ThemedText>
        <ThemedText style={styles.subtitle}>
          {totalCount > 0 && `${completedCount}/${totalCount} completed`}
        </ThemedText>
      </ThemedView>

      {/* Input Section */}
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a new todo..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
          returnKeyType="done"
          multiline={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </ThemedView>

      {/* Action Buttons */}
      {todos.length > 0 && (
        <ThemedView style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.clearButton]}
            onPress={clearCompleted}
          >
            <Ionicons name="trash-outline" size={16} color="white" />
            <Text style={styles.actionButtonText}>Clear Completed</Text>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Todo List */}
      {todos.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={64} color="#ccc" />
          <ThemedText style={styles.emptyText}>No todos yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>Add your first todo above!</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id}
          style={styles.todoList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  todoList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  completedTodo: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    opacity: 0.6,
  },
});
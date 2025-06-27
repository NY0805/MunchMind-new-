import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  user_id?: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user, isAuthenticated, isValidUser } = useUser();

  useEffect(() => {
    getTodos();
  }, [user, isAuthenticated]);

  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('todos').select('*').order('created_at', { ascending: false });

      // If user is authenticated and valid, filter by user_id
      if (isValidUser()) {
        query = query.eq('user_id', user.id);
      }

      const { data: todos, error } = await query;

      if (error) {
        console.error('Error fetching todos:', error.message);
        setError('Failed to fetch todos');
        return;
      }

      if (todos) {
        setTodos(todos);
      }
    } catch (error: any) {
      console.error('Error fetching todos:', error.message);
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      setError(null);
      
      const todoData: any = {
        title: newTodo.trim(),
        completed: false
      };

      // Add user_id if user is authenticated and valid
      if (isValidUser()) {
        todoData.user_id = user.id;
      }

      const { data, error } = await supabase
        .from('todos')
        .insert([todoData])
        .select()
        .single();

      if (error) {
        console.error('Error adding todo:', error.message);
        setError('Failed to add todo');
        return;
      }

      if (data) {
        setTodos([data, ...todos]);
        setNewTodo('');
      }
    } catch (error: any) {
      console.error('Error adding todo:', error.message);
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) {
        console.error('Error updating todo:', error.message);
        setError('Failed to update todo');
        return;
      }

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error: any) {
      console.error('Error updating todo:', error.message);
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting todo:', error.message);
        setError('Failed to delete todo');
        return;
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error: any) {
      console.error('Error deleting todo:', error.message);
      setError('Failed to delete todo');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (loading) {
    return (
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-md`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        Todo List
      </h2>

      {/* User status indicator */}
      {!isValidUser() && (
        <div className={`mb-4 p-3 rounded-lg ${
          theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
        }`}>
          <p className="text-sm">
            {!isAuthenticated ? 'Guest mode: Todos are shared across all users.' : 'Guest user: Please log in to save personal todos.'}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add new todo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className={`flex-1 px-3 py-2 rounded-lg border ${
            theme === 'dark'
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-gray-50 text-gray-800 border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-orange-400`}
        />
        <button
          onClick={addTodo}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            theme === 'synesthesia'
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className={`text-center py-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className={`transition-colors ${
                  todo.completed ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              
              <span
                className={`flex-1 ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-800'
                }`}
              >
                {todo.title}
              </span>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
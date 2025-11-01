import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Todo {
  _id: Id<"todos">;
  title: string;
  completed: boolean;
  order: number;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoScreen() {
  // Convex queries and mutations
  const todos = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const reorderTodos = useMutation(api.todos.reorderTodos);

  // Local state
  const [newTodo, setNewTodo] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [hoveredTodo, setHoveredTodo] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Load theme preference on mount
  useEffect(() => {
    AsyncStorage.getItem('theme').then((theme) => {
      if (theme) setIsDarkTheme(theme === 'dark');
    });
  }, []);

  // Save theme preference with animation
  const toggleTheme = async () => {
    Animated.timing(fadeAnim, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }).start();

    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  const headerBgImage = isDarkTheme
    ? (isMobile ? require('../../assets/images/mobd.jpg') : require('../../assets/images/webd.jpg'))
    : (isMobile ? require('../../assets/images/mobl.jpg') : require('../../assets/images/webl.png'));

  const theme = {
    light: {
      background: '#FAFAFA',
      cardBg: '#FFFFFF',
      text: '#494C6B',
      textLight: '#9495A5',
      inputBorder: '#E3E4F1',
      completedText: '#D1D2DA',
      checkboxBorder: '#E3E4F1',
      checkboxGradient: ['#55DDFF', '#C058F3'],
    },
    dark: {
      background: '#171823',
      cardBg: '#25273D',
      text: '#C8CBE7',
      textLight: '#5B5E7E',
      inputBorder: '#393A4B',
      completedText: '#4D5067',
      checkboxBorder: '#393A4B',
      checkboxGradient: ['#55DDFF', '#C058F3'],
    },
  };

  const currentTheme = isDarkTheme ? theme.dark : theme.light;

  // Filter todos
  const filteredTodos = (todos || []).filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const addTodo = async () => {
    if (newTodo.trim()) {
      await createTodo({ title: newTodo });
      setNewTodo('');
    }
  };

  const toggleTodo = async (id: Id<"todos">, currentCompleted: boolean) => {
    await updateTodo({ id, completed: !currentCompleted });
  };

  const handleDeleteTodo = async (id: Id<"todos">) => {
    await deleteTodo({ id });
  };

  const handleClearCompleted = async () => {
    await clearCompleted();
  };

  // Handle drag end - reorder todos
  const handleDragEnd = async ({ data }: { data: Todo[] }) => {
    const updates = data.map((todo, index) => ({
      id: todo._id,
      order: index,
    }));
    
    try {
      await reorderTodos({ updates });
    } catch (error) {
      console.error('Reorder failed:', error);
    }
  };

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => {
    const isHovered = hoveredTodo === item._id;
    const canDrag = filter === 'all'; // Only allow dragging in "All" view

    return (
      <ScaleDecorator>
        <View
          style={[
            styles.todoItem,
            {
              backgroundColor: currentTheme.cardBg,
              borderBottomColor: currentTheme.inputBorder,
              borderBottomWidth: 1,
              opacity: isActive ? 0.8 : 1,
            },
          ]}
          onPointerEnter={() => setHoveredTodo(item._id)}
          onPointerLeave={() => setHoveredTodo(null)}
        >
          {/* Drag Handle - Desktop only, only in "All" view */}
          {!isMobile && canDrag && (
            <TouchableOpacity
              onPressIn={drag}
              onLongPress={drag}
              style={[styles.dragHandle, { opacity: isHovered || isActive ? 0.5 : 0 }]}
            >
              <Text style={{ color: currentTheme.textLight, fontSize: 18 }}>☰</Text>
            </TouchableOpacity>
          )}

          {/* Placeholder for alignment when drag is disabled */}
          {!isMobile && !canDrag && (
            <View style={[styles.dragHandle, { opacity: 0 }]}>
              <Text style={{ color: currentTheme.textLight, fontSize: 18 }}>☰</Text>
            </View>
          )}

          {/* Checkbox */}
          <TouchableOpacity
            style={[styles.checkbox, { borderColor: currentTheme.checkboxBorder }]}
            onPress={() => toggleTodo(item._id, item.completed)}
          >
            {item.completed && (
              <LinearGradient
                colors={currentTheme.checkboxGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkboxChecked}
              >
                <Text style={styles.checkmark}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          {/* Todo Text - Make it draggable on mobile only in "All" view */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onLongPress={isMobile && canDrag ? drag : undefined}
            delayLongPress={200}
            disabled={!canDrag}
          >
            <Text
              style={[
                styles.todoText,
                {
                  color: item.completed ? currentTheme.completedText : currentTheme.text,
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>

          {/* Delete Button */}
          {(isHovered || isMobile) && (
            <TouchableOpacity onPress={() => handleDeleteTodo(item._id)} style={styles.deleteButton}>
              <Text style={[styles.deleteText, { color: currentTheme.textLight }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { backgroundColor: currentTheme.background, opacity: fadeAnim }]}>
        <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />

        {/* Header */}
        <ImageBackground
          source={headerBgImage}
          style={[styles.header, { height: isMobile ? 200 : 300 }]}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(158, 141, 213, 0.5)', 'rgba(126, 168, 245, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>TODO</Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <Text style={styles.themeIcon}>{isDarkTheme ? '☀' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Main Content */}
        <View style={[styles.content, { maxWidth: isMobile ? '100%' : 540, width: '100%' }]}>
          {/* Input Box */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, { backgroundColor: currentTheme.cardBg }]}>
              <View style={[styles.inputCheckbox, { borderColor: currentTheme.checkboxBorder }]} />
              <TextInput
                style={[styles.input, { color: currentTheme.text }]}
                placeholder="Create a new todo..."
                placeholderTextColor={currentTheme.textLight}
                value={newTodo}
                onChangeText={setNewTodo}
                onSubmitEditing={addTodo}
              />
            </View>
          </View>

          {/* Loading State */}
          {todos === undefined ? (
            <View style={[styles.todoCard, { backgroundColor: currentTheme.cardBg, padding: 40 }]}>
              <ActivityIndicator size="large" color="#3A7CFD" />
            </View>
          ) : (
            <>
              {/* Todo List Card */}
              <View style={[styles.todoCard, { backgroundColor: currentTheme.cardBg }]}>
                <DraggableFlatList
                  data={filteredTodos}
                  renderItem={renderTodoItem}
                  keyExtractor={(item) => item._id}
                  onDragEnd={filter === 'all' ? handleDragEnd : undefined}
                  activationDistance={10}
                  dragHitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={[styles.emptyText, { color: currentTheme.textLight }]}>
                        No todos to show
                      </Text>
                    </View>
                  }
                />

                {/* Footer */}
                <View style={[styles.footer, { borderTopColor: currentTheme.inputBorder }]}>
                  <Text style={[styles.footerText, { color: currentTheme.textLight }]}>
                    {(todos || []).filter((t) => !t.completed).length} items left
                  </Text>

                  {/* Desktop Filter */}
                  {!isMobile && (
                    <View style={styles.filterContainer}>
                      {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                        <TouchableOpacity key={f} onPress={() => setFilter(f)}>
                          <Text
                            style={[
                              styles.filterText,
                              {
                                color: filter === f ? '#3A7CFD' : currentTheme.textLight,
                                fontWeight: filter === f ? '700' : '400',
                              },
                            ]}
                          >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity onPress={handleClearCompleted}>
                    <Text style={[styles.footerText, { color: currentTheme.textLight }]}>
                      Clear Completed
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mobile Filter */}
              {isMobile && (
                <View style={[styles.mobileFilter, { backgroundColor: currentTheme.cardBg }]}>
                  {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                    <TouchableOpacity key={f} onPress={() => setFilter(f)}>
                      <Text
                        style={[
                          styles.filterText,
                          {
                            color: filter === f ? '#3A7CFD' : currentTheme.textLight,
                            fontWeight: filter === f ? '700' : '400',
                          },
                        ]}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.dragHint, { color: currentTheme.textLight }]}>
                {filter !== 'all' 
                  ? 'Switch to "All" to reorder todos'
                  : isMobile 
                    ? 'Long press and drag to reorder' 
                    : 'Drag and drop to reorder list'
                }
              </Text>
            </>
          )}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { width: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  headerContent: {
    width: '100%',
    maxWidth: 540,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: { fontSize: 40, fontWeight: '700', color: '#FFFFFF', letterSpacing: 15 },
  themeToggle: { padding: 8 },
  themeIcon: { fontSize: 26, color: '#FFFFFF' },
  content: { flex: 1, alignSelf: 'center', paddingHorizontal: 24, marginTop: -52 },
  inputWrapper: { marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputCheckbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, marginRight: 12 },
  input: { flex: 1, fontSize: 18, fontWeight: '400' },
  todoCard: {
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  todoItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
  dragHandle: { marginRight: 12, width: 20, justifyContent: 'center', alignItems: 'center' },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  checkmark: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  todoText: { fontSize: 18, fontWeight: '400' },
  deleteButton: { padding: 4 },
  deleteText: { fontSize: 18, fontWeight: '300' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerText: { fontSize: 14, fontWeight: '400' },
  filterContainer: { flexDirection: 'row', gap: 18 },
  filterText: { fontSize: 14, fontWeight: '700' },
  mobileFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 16,
    borderRadius: 5,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  dragHint: { textAlign: 'center', fontSize: 14, marginTop: 24 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14 },
});
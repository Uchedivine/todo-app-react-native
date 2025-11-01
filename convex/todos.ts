import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// GET all todos (sorted by order)
export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db
      .query("todos")
      .order("desc") // Most recent first
      .collect();
    
    return todos.sort((a, b) => a.order - b.order);
  },
});

// CREATE a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Server-side validation
    const trimmedTitle = args.title.trim();
    
    if (trimmedTitle.length === 0) {
      throw new Error("Todo title cannot be empty");
    }
    
    if (trimmedTitle.length > 200) {
      throw new Error("Todo title must be less than 200 characters");
    }
    
    // Get the count of existing todos to set order
    const existingTodos = await ctx.db.query("todos").collect();
    
    const newTodo = await ctx.db.insert("todos", {
      title: trimmedTitle,
      completed: false,
      order: existingTodos.length, // Add to end of list
      createdAt: Date.now(),
    });
    
    return newTodo;
  },
});

// UPDATE todo (toggle completion or edit title)
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    completed: v.optional(v.boolean()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, updates);
  },
});

// DELETE a todo
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// CLEAR all completed todos
export const clearCompleted = mutation({
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
    
    for (const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});

// BULK UPDATE orders (for drag & drop)
export const reorderTodos = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("todos"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { order: update.order });
    }
  },
});
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define our database schema
export default defineSchema({
  todos: defineTable({
    title: v.string(),
    completed: v.boolean(),
    order: v.number(), // For drag & drop ordering
    createdAt: v.number(),
  })
    .index("by_order", ["order"]) // Index for efficient ordering
    .index("by_creation", ["createdAt"]), // Index for sorting by creation time
});
"use client";

import { Task, TaskStatus } from "@/features/task/types/task.type";
import { TaskCard } from "@/features/task/components/task-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useUpdateTaskStatus } from "@/features/task/hooks/use-update-task-status";
import { cn } from "@/lib/utils";

// ─── Column definitions ───────────────────────────────────────────────────────

type ColumnDef = {
  id: TaskStatus;
  title: string;
  dot: string;
  countClass: string;
};

const COLUMNS: ColumnDef[] = [
  {
    id: "TODO",
    title: "To do",
    dot: "bg-amber-400",
    countClass: "bg-amber-400 text-white",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    dot: "bg-blue-500",
    countClass: "bg-blue-500 text-white",
  },
  {
    id: "DONE",
    title: "Done",
    dot: "bg-pink-500",
    countClass: "bg-pink-500 text-white",
  },
];

// ─── Sortable card wrapper ────────────────────────────────────────────────────

function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task, status: task.status },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} />
    </div>
  );
}

// ─── Droppable column ─────────────────────────────────────────────────────────

function KanbanColumn({ def, tasks }: { def: ColumnDef; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: def.id,
    data: { type: "column", status: def.id },
  });

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header — matches reference: dot + title + filled pill count */}
      <div className="flex items-center gap-2 px-1">
        <span className={cn("size-2.5 rounded-full shrink-0", def.dot)} />
        <span className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">
          {def.title}
        </span>
        <span
          className={cn(
            "ml-1 inline-flex size-5 items-center justify-center rounded-full text-[11px] font-bold leading-none",
            def.countClass,
          )}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2.5 rounded-2xl p-2 min-h-[120px] transition-colors duration-100",
          isOver ? "bg-zinc-100/80 dark:bg-zinc-800/50" : "bg-transparent",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-[12px] text-zinc-400">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

type KanbanBoardProps = {
  tasks: Task[];
  projectId: string;
  isLoading?: boolean;
};

export function KanbanBoard({ tasks, projectId, isLoading }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateStatus = useUpdateTaskStatus(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const validStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
    let targetStatus: TaskStatus | undefined;

    if (validStatuses.includes(over.id as TaskStatus)) {
      targetStatus = over.id as TaskStatus;
    } else if (
      over.data?.current?.status &&
      validStatuses.includes(over.data.current.status as TaskStatus)
    ) {
      targetStatus = over.data.current.status as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      targetStatus = overTask?.status;
    }

    if (
      targetStatus &&
      validStatuses.includes(targetStatus) &&
      targetStatus !== task.status
    ) {
      updateStatus.mutate({ projectId, taskId: task.id, status: targetStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Skeleton className="size-2.5 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-5 rounded-full ml-1" />
            </div>
            <div className="flex flex-col gap-2.5 p-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((col) => (
          <KanbanColumn key={col.id} def={col} tasks={getColumnTasks(col.id)} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {activeTask ? (
          <div className="rotate-1 scale-[1.03] shadow-2xl opacity-95">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

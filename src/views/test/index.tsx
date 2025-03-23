import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 列表项类型
interface Item {
  id: string;
  content: string;
}

// 可拖拽列表项组件
const SortableItem = ({ item }: { item: Item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-item"
    >
      {item.content}
    </div>
  );
};

// 主组件
const DraggableList = () => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 配置传感器（支持鼠标/触摸）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动8px才触发拖拽
      },
    })
  );

  // 拖拽开始事件
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // 拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  // 获取当前被拖拽的item
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="list-container">
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>

      {/* 拖拽时的预览效果 */}
      <DragOverlay>
        {activeItem ? (
          <div className="list-item dragging">{activeItem.content}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// 添加基础样式
const styles = `
  .list-container {
    max-width: 400px;
    margin: 20px auto;
  }

  .list-item {
    padding: 12px;
    margin: 8px 0;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .list-item.dragging {
    background: #f0f0f0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transform: rotate(3deg);
  }
`;

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <DraggableList />
    </>
  );
}
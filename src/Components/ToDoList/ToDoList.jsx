import React, { useReducer, useState } from "react";
import "./toDoList.css";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        todo: [...state.todo, action.payload],
      };
    case "EDIT_TASK":
      return {
        ...state,
        todo: state.todo.map((el) =>
          el.id === action.payload.id ? { ...el, task: action.payload.task } : el
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        todo: state.todo.filter((el) => el.id !== action.payload),
      };
    case "SET_CURRENT_TASK":
      return {
        ...state,
        currentTask: action.payload,
      };
    case "SET_EDITING":
      return {
        ...state,
        isEditing: action.payload.isEditing,
        editId: action.payload.editId,
      };
    case "CLEAR_CURRENT_TASK":
      return {
        ...state,
        currentTask: "",
      };
    default:
      return state;
  }
};

const TodoList = () => {
  const [state, dispatch] = useReducer(reducer, {
    todo: [],
    currentTask: "",
    isEditing: false,
    editId: null,
  });

  const addTask = (e) => {
    e.preventDefault();
    if (state.currentTask.trim() === "") {
      return;
    }

    if (state.isEditing) {
      dispatch({
        type: "EDIT_TASK",
        payload: { id: state.editId, task: state.currentTask },
      });
      dispatch({ type: "SET_EDITING", payload: { isEditing: false, editId: null } });
    } else {
      const newTask = {
        id: new Date().getTime(),
        task: state.currentTask,
        completed: false,
      };
      dispatch({ type: "ADD_TASK", payload: newTask });
    }
    dispatch({ type: "CLEAR_CURRENT_TASK" });
  };

  const deleteTask = (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const editTask = (id) => {
    const taskToEdit = state.todo.find((el) => el.id === id);
    dispatch({ type: "SET_CURRENT_TASK", payload: taskToEdit.task });
    dispatch({ type: "SET_EDITING", payload: { isEditing: true, editId: id } });
  };

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Write your task"
          value={state.currentTask}
          onChange={(e) =>
            dispatch({ type: "SET_CURRENT_TASK", payload: e.target.value })
          }
        />
        {state.isEditing ? (
          <button type="submit">Save</button>
        ) : (
          <button type="submit">Add</button>
        )}
      </form>

      <div>
        <hr />
        {state.todo.map((el) => (
          <div className="task" key={el.id}>
            <h2>{el.task}</h2>
            <div className="taskBtns">
              <button onClick={() => editTask(el.id)}>
                <FaEdit />
              </button>
              <button onClick={() => deleteTask(el.id)}>
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";
import { PencilIcon, Trash2 } from "lucide-react";
import axios from "axios";

interface pageProps {}

interface todoProps {
  // id: number;
  id: string;
  title: string;
  task: string;
  done: boolean;
  created_at: string;
}

const page: FC<pageProps> = ({}) => {
  const [value, setValue] = useState({
    title: "",
    task: "",
    done: false,
  });
  const [add, setAdd] = useState(true);
  const [todos, setTodos] = useState<todoProps[]>([]);

  useEffect(() => {
    getTodoList();
  }, []);

  const getTodoList = async () => {
    const result = await axios.get("http://localhost:8080/api/v1/todos");
    const todoList = result.data.todos;
    todoList.sort((a: todoProps, b: todoProps) => {
      return a.created_at < b.created_at ? -1 : 1;
      // return a.created_at - b.created_at;
    });
    // todoList.sort((a:todoProps, b:todoProps) => a.created_at.getTime() - b.created_at.getTime());

    setTodos(todoList);
    console.log(result.data, "todos");
  };

  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const onChangeCheck = async (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: string
  ) => {
    // setValue((prev) => ({
    //   ...prev,
    //   done: event.target.checked,
    // }));
    try {
      const result = await axios.put(
        `http://localhost:8080/api/v1/todo/checked/${todoId}`,
        {
          done: event.target.checked,
        }
      );
      if (result.status === 200) {
        getTodoList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAdd = () => setAdd(!add);

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value?.title || value?.title.trim() === "") return;
    try {
      // const id = Date.now();
      // const todoVal: todoProps = { id: id, ...value };

      // setTodos([...todos, todoVal]);
      const result = await axios.post("http://localhost:8080/api/v1/todo", {
        ...value,
      });
      if (result.status === 200) {
        await getTodoList();
        setValue({ title: "", task: "", done: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const result = await axios.delete(
        `http://localhost:8080/api/v1/todo/${id}`
      );
      if (result.status === 200) {
        getTodoList();
      }
      //const newTodos = todos.filter((todo, i) => todo.id !== id);
      //      setTodos(newTodos);//
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-10">
      <h1 className="text-3xl">Todo List</h1>
      <div className="flex gap-2 my-6">
        {add && (
          <form id="todoForm" onSubmit={addTodo} className="flex gap-2">
            <Input
              placeholder="Title"
              autoFocus
              className="hover:shadow-lg ease-in-out"
              value={value?.title}
              name="title"
              onChange={onChangeValue}
            />
            <Input
              placeholder="Content"
              autoFocus
              className="hover:shadow-lg ease-in-out"
              value={value?.task}
              name="task"
              onChange={onChangeValue}
            />
            <Button variant={"ghost"} form="todoForm">
              Submit
            </Button>
          </form>
        )}
        <Button onClick={toggleAdd}>{add ? "Close" : "Add"}</Button>
      </div>
      <div className="flex flex-col gap-2">
        {todos.map((todo, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-6 h-6 border-2 border-gray-400 rounded-md cursor-pointer"
              checked={todo.done}
              onChange={(e) => onChangeCheck(e, todo.id)}
            />
            <div className="m-2">
              <p className="text-lg font-bold text-gray-700">{todo?.title}</p>
              <p className="text-gray-400">{todo?.task}</p>
            </div>
            <Button variant={"destructive"} onClick={() => deleteTodo(todo.id)}>
              <Trash2 />
            </Button>
            <Button variant={"ghost"} onClick={() => deleteTodo(todo.id)}>
              <PencilIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;

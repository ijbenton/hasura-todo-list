import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import { api } from '../graphql/generated/graphql';
import { Todo } from '../model/Todo';
import { selectUser } from '../redux/slices/authSlice';
import { selectMyTodos } from '../redux/slices/todosSlice';

const Dashboard = () => {
  const todos = useSelector(selectMyTodos);
  const user = useSelector(selectUser);
  const [getMyTodos, getMyTodosResult] =
    api.endpoints.GetMyTodos.useLazyQuery();
  const [createPersonalTodo, createPersonalTodoResult] =
    api.endpoints.CreatePersonalTodo.useMutation();
  const [updateTodo, updateTodoResult] = api.endpoints.UpdateTodo.useMutation();

  const handleCheckTodo = (todo: Todo) => () => {
    updateTodo({ id: todo.id, is_completed: !todo.is_completed });
  };

  useEffect(() => {
    getMyTodos();
  }, []);

  useEffect(() => {
    if (getMyTodosResult.isSuccess) {
      console.log('oi');
    } else if (getMyTodosResult.isError) {
      console.log('er');
    }
  }, [getMyTodosResult.isError, getMyTodosResult.isSuccess]);
  useEffect(() => {
    if (createPersonalTodoResult.isSuccess) {
    } else if (createPersonalTodoResult.isError) {
      console.log('er');
    }
  }, [createPersonalTodoResult.isError, createPersonalTodoResult.isSuccess]);
  return (
    <div className="mx-auto relative w-1/2 px-2 sm:px-6 lg:px-8">
      <section className="flex flex-col px-4 py-4">
        <div className="text-gray-700 font-normal text-lg">Personal Todos</div>
        <div className="w-full flex flex-col px-4 py-4 shadow-xl">
          <Formik
            initialValues={{ title: '' }}
            validationSchema={Yup.object({
              title: Yup.string().required('')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                const res = await createPersonalTodo({
                  title: values.title
                });
                resetForm();
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <div className="my-2 text-red-400">
                  <input
                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    type="text"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                    placeholder="What needs to be done?"
                  />
                  {errors.title && touched.title && errors.title}
                </div>
              </Form>
            )}
          </Formik>
          <ul>
            {todos?.map((item) => (
              <li className="flex items-center" key={item.id}>
                <div className="flex items-center">
                  <input
                    checked={item.is_completed}
                    id="checked-checkbox"
                    type="checkbox"
                    onClick={handleCheckTodo(item)}
                    className="w-6 h-6 my-2 mr-2 cursor-pointer text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="">{item.title}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

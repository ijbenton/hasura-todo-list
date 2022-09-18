import { XMarkIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import values from 'lodash.values';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import Spinner from '../components/common/Spinner';
import { api } from '../graphql/generated/graphql';
import { DeletableTodo } from '../model/DeletableTodo';
import { selectUser } from '../redux/slices/authSlice';
import { removeTodo, selectMyTodos } from '../redux/slices/todosSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectMyTodos);
  const [getMyTodos, getMyTodosResult] =
    api.endpoints.GetMyTodos.useLazyQuery();
  const [createPersonalTodo, createPersonalTodoResult] =
    api.endpoints.CreatePersonalTodo.useMutation();
  const [updateTodo, updateTodoResult] = api.endpoints.UpdateTodo.useMutation();
  const [deleteTodo, deleteTodoResult] = api.endpoints.DeleteTodo.useMutation();

  const handleCheckTodo = (todo: DeletableTodo) => () => {
    updateTodo({ id: todo.id, is_completed: !todo.is_completed });
  };

  const handleDeleteTodo = (todo: DeletableTodo) => () => {
    deleteTodo({ id: todo.id });
  };

  useEffect(() => {
    getMyTodos();
  }, []);

  useEffect(() => {
    if (deleteTodoResult.isSuccess) {
      dispatch(removeTodo(deleteTodoResult.originalArgs?.id as number));
    }
  }, [deleteTodoResult.isSuccess]);
  return (
    <div className="mx-auto relative w-1/2 px-2 sm:px-6 lg:px-8">
      <section className="flex flex-col px-4 py-4">
        <div className="text-gray-800 font-normal text-2xl text-center">
          Personal Todos
        </div>
        <div className="w-full flex flex-col px-6 py-6 shadow-xl">
          <Formik
            initialValues={{ title: '' }}
            validationSchema={Yup.object({
              title: Yup.string().required('')
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                await createPersonalTodo({
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
            {values(todos)?.map((item) => (
              <li className="flex items-center w=full my-2" key={item.id}>
                <div className="flex items-center">
                  <input
                    checked={item.is_completed}
                    id="checked-checkbox"
                    type="checkbox"
                    onClick={handleCheckTodo(item)}
                    className="w-6 h-6 my-2 mr-2 cursor-pointer text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div
                  className={`${item.is_completed ? 'line-through' : ''} ml-1`}
                >
                  {item.title}
                </div>
                <div className="ml-auto">
                  {item.deletion_status === 'pending' ? (
                    <Spinner color="black" />
                  ) : (
                    <XMarkIcon
                      onClick={handleDeleteTodo(item)}
                      className="block h-6 w-6 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

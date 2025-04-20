import React from 'react'
import { useEmployees } from '../context/EmployeesContext';
import { UserList } from '../components/UserList';

export const Login = () => {

        const { employees, loading, refreshEmployees, setEditedEmployee, page, totalPages, setPage } = useEmployees();


  return (
    <h1>Hola Mundo</h1>

)
}

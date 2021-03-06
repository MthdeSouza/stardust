/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React, { useContext } from "react";
import TodosContext from "../contexts/todoContext";
import { Table, Space, Divider } from "antd";
import "antd/dist/antd.css";
import baseUrl from "../globals/baseUrl";
import moment from "moment";

export default function TodoList() {
  const { state, dispatch } = useContext(TodosContext);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  const columns = [
    {
      title: "Descrição",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Tipo da conta",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Vencimento",
      key: "dataVencimento",
      render: (text, record) => (
        <>{moment(record.dataVencimento).format("DD/MM/YYYY")}</>
      ),
    },
    {
      title: "Valor",
      render: (text, record) => <>{formatter.format(record.price)}</>,
      className: "column-money",
      key: "Price",
    },

    {
      title: "Ações",
      key: "action",
      render: (text, record) => (
        <Space size="middle" key={record._id}>
          <a
            className="cursor-pointer font-medium"
            key="list-event-edit"
            onClick={() => {
              dispatch({ type: "SET_CURRENT_TODO", payload: record });
            }}
          >
            Selecionar
          </a>
          <a
            className="cursor-pointer text-red-500 font-medium"
            key="list-event-delete"
            onClick={async () => {
              const response = await axios.delete(`${baseUrl}/todos/`, {
                data: { _id: record._id },
              });
              dispatch({ type: "REMOVE_TODO", payload: response.data._id });
            }}
          >
            Remover
          </a>
        </Space>
      ),
    },
  ];

  const saldo = state.todos.reduce(function (sum, todo) {
    if (todo.tipo === "Receber" && todo.complete) {
      sum = sum + parseFloat(todo.price);
    } else if (todo.tipo === "Pagar" && todo.complete) {
      sum = sum - parseFloat(todo.price);
    }
    return sum;
  }, 0);

  return (
    <div className="container mx-auto max-w-6xl text-center font-mono p-2 mt-2">
      <Divider orientation="left">Tabela de Centro de Custo</Divider>
      <Table
        columns={columns}
        dataSource={state.todos}
        rowKey={(record) => record._id}
        expandable={{
          expandedRowRender: (record) => (
            <div className="flex justify-between">
              <p className="flex-1">Descrição: {record.text}</p>
              <a
                className={record.complete ? "text-red-500" : ""}
                onClick={async () => {
                  const newTodo = {
                    ...record,
                    complete: !record.complete,
                  };
                  const response = await axios.put(`${baseUrl}/todos`, {
                    todo: newTodo,
                    _id: record._id,
                  });

                  dispatch({ type: "TOGGLE_TODO", payload: response.data });
                }}
              >
                {record.complete ? "Cancelar pagamento" : "Concluír pagamento"}
              </a>
            </div>
          ),
          rowExpandable: (record) => record !== null,
        }}
        rowClassName={(record, index) =>
          record.tipo === "Pagar"
            ? record.complete
              ? "bg-Amber-700"
              : "bg-amber-900"
            : record.complete
            ? "bg-lime-700"
            : "bg-lime-900"
        }
      />
      <div className="font-bold">Saldo atual: {formatter.format(saldo)}</div>{" "}
    </div>
  );
}

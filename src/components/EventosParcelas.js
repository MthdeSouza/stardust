/* eslint-disable no-template-curly-in-string */
import React, { useContext } from "react";
import {
  Table,
  Button,
  Form,
  Col,
  Input,
  Row,
  InputNumber,
  DatePicker,
  Divider,
} from "antd";
import EventosContext from "./contexts/eventoContext";
import locale from "./globals/locale";
import axios from "axios";
import { uuid } from "uuidv4";
import currencyList from "./globals/currency";
import baseUrl from "./globals/baseUrl";

export default function EventoParcelas() {
  // const [todo, setTodo] = useState("");

  const { state, dispatch } = useContext(EventosContext);

  const currencyParser = (val) => {
    try {
      // for when the input gets clears
      if (typeof val === "string" && !val.length) {
        val = "0.0";
      }

      // detecting and parsing between comma and dot
      var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
      var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
      var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
      reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
      reversedVal = reversedVal.replace(/[^0-9.]/g, "");
      const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
      const needsDigitsAppended = digitsAfterDecimalCount > 2;

      if (needsDigitsAppended) {
        reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
      }

      return Number.isNaN(reversedVal) ? 0 : reversedVal;
    } catch (error) {
      console.error(error);
    }
  };

  const formRef = React.createRef();
  const dateFormat = "DD/MM/YYYY";
  const [form] = Form.useForm();

  const currencyFormatter = (selectedCurrOpt) => (value) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: selectedCurrOpt.split("::")[1],
    }).format(value);
  };

  const columns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Valor",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "Vencimento",
      dataIndex: "dataVencimento",
      key: "dataVencimento",
    },
  ];

  const validateMessages = {
    required: "${label} é obrigatório",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  // const handleDateChange = (date, dateString) => {
  //   if (!!date) {
  //     setTodo({ dataVencimento: dateString });
  //   }
  // };

  const onFinish = async (values) => {
    const newValues = {
      ...values,
      dataVencimento: values["dataVencimento"].format(dateFormat),
    };

    const response = await axios.post(`${baseUrl}/todos/`, {
      id: uuid(),
      titulo: newValues.titulo,
      text: newValues.text || "",
      price: newValues.price,
      complete: false,
      tipo: "Receber",
      dataVencimento: newValues.dataVencimento,
      centroCusto: [],
      eventoId: state.currentEvento._id,
    });
    dispatch({ type: "ADD_EVENTO_TODOS", payload: response.data });
  };

  return (
    <div>
      <EventosContext.Provider value={{ state, dispatch }}>
        <Col span={22} offset={1}>
          <Form
            onFinish={onFinish}
            ref={formRef}
            layout="vertical"
            form={form}
            initialValues="vertical"
            className="flex-1 m-2 "
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Título"
              name="titulo"
              rules={[{ required: true }]}
              form={form}
            >
              <Input placeholder="Nome da parcela" id="EPtitulo" />
            </Form.Item>
            <Form.Item label="Descrição" name="text" form={form}>
              <Input.TextArea
                rows="2"
                placeholder="Detalhes sobre a parcela"
                id="EPtext"
                className="flex-1 border-grey border-solid border-2 mr-2 p-1 w-full"
              />
            </Form.Item>
            <Row>
              <Col span={6} offset={0}>
                <Form.Item
                  label="Valor da parcela"
                  name="price"
                  rules={[{ required: true }]}
                  form={form}
                >
                  <InputNumber
                    id="EPprice"
                    style={{ width: "auto" }}
                    placeholder="R$ 0.00"
                    prefix="R$ "
                    formatter={currencyFormatter(
                      `${currencyList.CtryNm}::${currencyList.Ccy}`
                    )}
                    parser={currencyParser}
                  />
                </Form.Item>
              </Col>
              <Col span={8} offset={1}>
                <Form.Item
                  label="Data de vencimento"
                  name="dataVencimento"
                  rules={[{ required: true }]}
                  form={form}
                >
                  <DatePicker
                    format={dateFormat}
                    placeholder="01/01/2001"
                    // onChange={handleDateChange}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={0}>
                <Button type="primary" block htmlType="submit">
                  Adicionar parcela
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Divider orientation="left">Parcelas vinculadas ao evento</Divider>
        <Table
          columns={columns}
          dataSource={state.eventoTodos}
          rowKey={(record) => record._id}
        />
      </EventosContext.Provider>
    </div>
  );
}

import { useEffect, useState } from 'react'
import './App.css'
import { Button, Form, Modal ,Input} from 'antd'

type List = {
  id: number;
  name: string;
  num: number;
  price:number
}
function App() {
  const [list, setList] = useState<List[]>([])
  const [visible, setVisible] = useState(false)
  const [item,setItem]=useState<List | null>()
  useEffect(() => {
    fetch("/api/list", {
      method: "GET",
      // 其他请求配置...
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        // console.log(JSON.parse(res));
        console.log(JSON.parse(res));
        
        setList(JSON.parse(res));
      })
      .catch((error) => {
        console.error(error);
      });
  },[])

  return (
    <div className='box'>
      <Button style={{ position: "absolute", top: "20px", right: "20px" }} onClick={() => {
        setVisible(true)
        setItem(null)
      }}>添加</Button>
      <ul>
      <li>
            <div>名称</div>
            <div>数量(单位)</div>
            <div>价格(元)</div>
            <div>操作</div>
          </li>
        {list.map((it) => {
          return <li key={it.id}>
            <div>{it?.name}</div>
            <div>{it?.name}</div>
            <div>{it?.name}</div>
            <div>
            <a onClick={() => {
                setItem(it)
                setVisible(true)
              }}>修改</a>
            <a style={{ marginLeft: "16px" }} onClick={() => {
                
              }}>删除</a>
            </div>
          </li>
        })}
      </ul>
      <UpdataModal
        open={visible}
        onOk={() => {
        setVisible(false)
        }}
        onCancel={() => {
        setVisible(false)
        }}
        item={item} />
    </div>
  )
}

export default App


function UpdataModal({ onOk, onCancel, open,item }: any) {
  
  const [form] = Form.useForm<List>();
console.log(item);

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  }, [item]);

  return (
    <Modal title={item?.id?"修改":"添加"} open={open} onOk={() => {
      form.submit();
      }} onCancel={onCancel}>
        <Form
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={(payload) => {
          onOk({ ...item, ...payload });
        }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]}
        >
          <Input placeholder={'请输入'} maxLength={20} />
        </Form.Item>
        <Form.Item
          label="数量"
          name="num"
          rules={[
            {
              required: true,
              message: '请输入数量',
            },
          ]}
        >
          <Input placeholder={'请输入'} maxLength={20} />
        </Form.Item>
        <Form.Item
          label="单价"
          name="price"
          rules={[
            {
              required: true,
              message: '请输入单价',
            },
          ]}
        >
          <Input placeholder={'请输入'} maxLength={20} />
        </Form.Item>
      </Form>
      </Modal>
  );
};
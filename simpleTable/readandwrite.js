const http = require("http");
// 导入url模块
const url = require("url");
const fs = require("fs");
// 引入path模块
const path = require("path");

// 读取文件方法
const readFile = (url) => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const server = http.createServer((req, res) => {
  //实例化 url对象 new、
  let urlObj = new URL(req.url, "http://localhost:8766");
  console.log(req.method);
  let fileName = urlObj.pathname.replaceAll("/", "_");
  // 读取文件
  let filePath = path.resolve(__dirname, `./data/${fileName}.json`);
  res.writeHead(200, { "Content-Type": "application/json" });
  if (req.method === "GET") {
    fs.readFile(filePath, (err, data) => {
      //err 错误信息 data 读取到的数据
      if (err) {
        console.log(err);
        return;
      }
      console.log(JSON.parse(data.toString()));
      // 响应客户端
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data.toString()));
    });
  } else if (req.method === "PUT") {
    let body = "";
    // 监听 data 事件，将请求主体的数据存储在 body 中
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    // 监听 end 事件，表示请求主体数据接收完毕
    req.on("end", () => {
      // 此时，变量 body 中包含了请求主体的数据
      console.log("Request body:", body);
      // 在这里可以将 body 中的数据写入文件或进行其他处理
      // 写入文件
      fs.writeFile(filePath, body, (err) => {
        if (err) {
          res.end({ error: "写入文件失败" });
        } else {
          res.end({ success: "写入文件成功" });
        }
      });
      // 响应客户端
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: "写入文件成功" }));
    });
  }
});
// 监听端口，启动服务
server.listen(8766, () => {
  console.log("服务已经启动");
});
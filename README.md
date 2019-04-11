# mp-wx-sdk
二次封装微信接口，将微信接口Promise化，方便使用async/await

# 安装

```
npm install mp-wx-sdk
```

# 使用

```
import MpWxSdk from 'mp-wx-sdk';
const WeChat = new MpWxSdk(wx);

async function (){
  await WeChat.login();
}
```



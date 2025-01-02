## Contoh kode plugin:
```js
export default {
    name: "Ping", //Nama plugin
    triggers: ["ping"], //Trigger plugin (bisa lebih dari satu)
		//prefix: "" //Custome prefix jika diakrifkan maka hanha akan menggunakan prefix yang ditentukan disini. jika tidak maka akan menggunakan prefix difile konfigurasi  (Cek file config.js)
    code: async (ctx) => {
        ctx.reply("pong") //Mengirim pesan "Pong" ketika ada yang mentrigger plugin.
    }
}

```

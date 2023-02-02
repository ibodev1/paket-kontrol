# paket-kontrol

> Projenizde yüklü npm paketlerinin versiyonlarının güncel olup olmadığını kontrol etmeniz için yardımcı cli pakedi.

## İndirme

[Node.js](https://nodejs.org) 14+ sürümünün kurulu olduğundan emin olun. Ardından aşağıdakileri çalıştırın:

```sh
npm install --global paket-kontrol
```
yada
```sh
yarn global add paket-kontrol
```

## Kullanım

### Paket kontrol için
```sh
paket-kontrol
```
yada
```sh
npx paket-kontrol
```

<img src="1.png" width="400">

### Güncel olmayan paketleri güncellemek için.
```sh
paket-kontrol -u
```
yada
```sh
npx paket-kontrol -u
```

<img src="2.png" width="400">

## İlişkili & Önerilen

- [npm-check-updates](https://github.com/raineorshine/npm-check-updates) - Npm paketlerinizi güncel tutmanız için ilham aldığım paket.
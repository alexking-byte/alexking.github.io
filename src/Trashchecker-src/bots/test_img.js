var file = document.getElementById('webchat');
var result = document.getElementById('result');

// File APIに対応しているか確認
if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalImage(e) {
        // ファイル情報を取得
        var fileData = e.target.files[0];
        result.innerHTML=fileData;
        console.log(fileData); // 取得した内容の確認用


 
        // 画像ファイル以外は処理を止める
        if(!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }
 
        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
            var img = document.createElement('img');
                img.id = 'imgid';
            var targetImg = img;
            targetImg.width = 100;
            targetImg.height = 100;
            img.src = reader.result;
            result.appendChild(img);
            result_base64.innerHTML =img.src;
        }
        // ファイル読み込みを実行
        reader.readAsDataURL(fileData);
        

    }
    file.addEventListener('change', loadLocalImage, false);
    
 
} else {
    file.style.display = 'none';
    result.innerHTML = 'File APIに対応したブラウザでご確認ください';
}
console.log("ああああああ");
console.log("画像"+result_base64);


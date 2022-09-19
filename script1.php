<?php



$HTTP_HOST = $_SERVER["HTTP_HOST"];
$name=$_POST["Email"];
$youremail = $_POST["YOUREMAIL"];
print_r($_POST);
var_dump($_POST["tarif"]);
var_dump($_POST["numberOfUsers"]);
$messag = "Письмо об обратном звонке с сайта " . $HTTP_HOST . "\n";
$messag = $messag . "-------------------------------------- \n\n";
$messag = $messag . "Email клиента: " . substr(htmlspecialchars($name), 0, 62) . "\n";
if ($_POST["Tel"] !== "") {
    $phone = $_POST["Tel"];
    $messag = $messag . "Номер телефона клиента: " . substr(htmlspecialchars($phone), 0, 62) . "\n";
};
if ($_POST["tarif"] !== "") {
    $tarif = $_POST["tarif"];
    $messag = $messag . "Тариф выбранный клиентом: " . substr(htmlspecialchars($tarif), 0, 62) . "\n";
};
if ($_POST["numberOfUsers"] !== "") {
    $numberOfUsers = $_POST["numberOfUsers"];
    $messag = $messag . "Количество рабочих мест у клиента: " . substr(htmlspecialchars($numberOfUsers), 0, 62) . "\n";
};
$messag = $messag . "-------------------------------------- \n\n";
$messag = $messag . "Дата: " . date("d.m.Y h:i") . "\n";
$messag = $messag . "IP: " . htmlspecialchars($_SERVER['REMOTE_ADDR']);

$body = $messag;
if (mail("zhenyaglibko@gmail.com", "Письмо email с сайта " . $HTTP_HOST , $body, "From: info@infa.ru\r\n")) {
    echo "Спасибо. Ваша заявка отправлена.  В ближайшее время с вами свяжется наш менеджер";
} else {
    echo "при отправке сообщения возникли ошибки";
}
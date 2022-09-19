<?php



$HTTP_HOST = $_SERVER["HTTP_HOST"];
$name=$_POST["i1"];
$messag = "Письмо об обратном звонке с сайта " . $HTTP_HOST . "\n";
$messag = $messag . "-------------------------------------- \n\n";
$messag = $messag . "Email клиента: " . substr(htmlspecialchars($_POST["i1"]), 0, 62) . "\n";
$messag = $messag . "-------------------------------------- \n\n";
$messag = $messag . "Дата: " . date("d.m.Y h:i") . "\n";
$messag = $messag . "IP: " . htmlspecialchars($_SERVER['REMOTE_ADDR']);

$body = $messag;
if (mail("dipahe3378@ploneix.com", "Письмо email с сайта " . $HTTP_HOST , $body, "From: info@infa.ru\r\n")) {
    echo "Спасибо. Ваша заявка отправлена.  В ближайшее время с вами свяжется наш менеджер";
} else {
    echo "при отправке сообщения возникли ошибки";
}
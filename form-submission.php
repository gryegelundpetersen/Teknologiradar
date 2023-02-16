
<?php
$techName = $_POST['techName'];
$x = intval($_POST['x']);
$y = floatval($_POST['y']);
$description = $_POST['description'];
$tm = $_POST['tm'] == "True" ? true : false;
$ks = $_POST['ks'] == "True" ? true : false;
$komstab = $_POST['komstab'] == "True" ? true : false;
$velfaerd = $_POST['velfaerd'] == "True" ? true : false;
$oea = $_POST['oea'] == "True" ? true : false;
$bu = $_POST['bu'] == "True" ? true : false;
$link = $_POST['link'];
$maturity = intval($_POST['maturity']);

$jsonString = file_get_contents('technologies.json');
$data = json_decode($jsonString, true);

$newEntry = array(
    "techName" => $techName,
    "x" => $x,
    "y" => $y,
    "description" => $description,
    "administrations" => array(
        "tm" => $tm,
        "ks" => $ks,
        "komstab" => $komstab,
        "velfaerd" => $velfaerd,
        "oea" => $oea,
        "bu" => $bu
    ),
    "link" => $link,
    "maturity" => $maturity
);

array_push($data['technologies'], $newEntry);

$newJsonString = json_encode($data);
file_put_contents('data.json', $newJsonString);

?>
<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');


function encodeImage($image) {
    return base64_encode($image);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idAutoroute'])) {
        $query = "SELECT idAutoroute, serial_number, type, solde, imgp FROM autoroute WHERE idAutoroute = :idAutoroute;";
        $params = array(':idAutoroute' => $_GET['idAutoroute']);
        $result = metodGet($query, $params);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        // Encode the image data to base64
        foreach ($data as &$row) {
            if (isset($row['imgp'])) {
                $row['imgp'] = encodeImage($row['imgp']);
            }
        }
        echo json_encode($data);
    } else {
        $query = "SELECT idAutoroute, serial_number, type, solde, imgp FROM autoroute";
        $result = metodGet($query);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        // Encode the image data to base64
        foreach ($data as &$row) {
            if (isset($row['imgp'])) {
                $row['imgp'] = encodeImage($row['imgp']);
            }
        }
        echo json_encode($data);
    }
    header("HTTP/1.1 200 OK");
    exit();
}


if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $type = $_POST['type'];
    $serial_number = $_POST['serial_number'];
    $solde = $_POST['solde'];

    // Handle file upload for imgp
    // if (isset($_FILES['imgp']) && $_FILES['imgp']['error'] == 0) {
    //     $imgp = file_get_contents($_FILES['imgp']['tmp_name']);
    // } else {
    //     $imgp = null;
    // }
    if (isset($_FILES['imgp']) && $_FILES['imgp']['error'] == 0) {
        $imgp = file_get_contents($_FILES['imgp']['tmp_name']);
    } else {
        $imgp = null;
    }
    

    $query = "INSERT INTO autoroute(type, serial_number, solde, imgp) VALUES (:type, :serial_number, :solde, :imgp)";
    $params = array(':type' => $type, ':serial_number' => $serial_number, ':solde' => $solde, ':imgp' => $imgp);
    $queryAutoIncrement = "SELECT MAX(idAutoroute) as idAutoroute FROM autoroute;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idAutoroute = $_GET['idAutoroute'];
    $type = $_POST['type'];
    $serial_number = $_POST['serial_number'];
    $solde = $_POST['solde'];



    $query = "UPDATE autoroute SET type = :type, serial_number = :serial_number,solde=:solde WHERE idAutoroute = :idAutoroute";
    $params = array(':idAutoroute' => $idAutoroute, ':type' => $type, ':serial_number' => $serial_number, ':solde' => $solde);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idAutoroute = $_GET['idAutoroute'];
    $query = "DELETE FROM autoroute WHERE idAutoroute = :idAutoroute;";
    $params = array(':idAutoroute' => $idAutoroute);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>

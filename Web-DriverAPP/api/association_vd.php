<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idAVD'])) {
        $query = "SELECT a.idAVD, a.idVcl, d.idDriver, d.numE, d.nom, d.prenom, v.regNumber, v.type, 
                         a.date_start, a.date_end, DATE_FORMAT(a.time, '%H:%i') as time,u.username
                  FROM association_vd a 
                  JOIN driver d ON d.idDriver = a.idDriver 
                  JOIN vehicle v ON v.idVcl = a.idVcl 
                  join users u on a.idUser=u.idUser
                  WHERE a.idAVD = :idAVD;";
        $params = array(':idAVD' => $_GET['idAVD']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT a.idVcl, a.idAVD, d.idDriver, d.numE, d.nom, d.prenom, v.regNumber, v.type, 
                         a.date_start, a.date_end, DATE_FORMAT(a.time, '%H:%i') as time,u.username
                  FROM association_vd a 
                  JOIN driver d ON d.idDriver = a.idDriver 
                  JOIN vehicle v ON v.idVcl = a.idVcl
                  join users u on a.idUser=u.idUser;";
                  
        $result = metodGet($query);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    }

    exit();
}


if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idDriver = $_POST['idDriver'];
    $idVcl = $_POST['idVcl'];
    $date_start = $_POST['date_start'];
    $date_end = $_POST['date_end'];
    $time = $_POST['time']; // Add this line
    $idUser = $_POST['idUser'];

    $query = "INSERT INTO association_vd(idDriver, idVcl, date_start, date_end, time, idUser) VALUES (:idDriver, :idVcl, :date_start, :date_end, :time, :idUser)"; // Include 'time' in the query
    $params = array(
        ':idDriver' => $idDriver,
        ':idVcl' => $idVcl,
        ':date_start' => $date_start,
        ':date_end' => $date_end,
        ':time' => $time, // Include 'time' in the parameters
        ':idUser' => $idUser
    );

    $queryAutoIncrement = "SELECT MAX(idAVD) as idAVD FROM association_vd;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idAVD = $_GET['idAVD'];
    $idDriver = $_POST['idDriver'];
    $idVcl = $_POST['idVcl'];
    $date_start = $_POST['date_start'];
    $date_end = $_POST['date_end'];
    $time = $_POST['time']; // Add this line

    $query = "UPDATE association_vd SET idDriver = :idDriver, idVcl = :idVcl, date_start = :date_start, date_end = :date_end, time = :time WHERE idAVD = :idAVD;"; // Include 'time' in the query
    $params = array(
        ':idAVD' => $idAVD,
        ':idDriver' => $idDriver,
        ':idVcl' => $idVcl,
        ':date_start' => $date_start,
        ':date_end' => $date_end,
        ':time' => $time 
    );
    
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idAVD = $_GET['idAVD'];
    $query = "DELETE FROM association_vd WHERE idAVD = :idAVD;";
    $params = array(':idAVD' => $idAVD);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


?>

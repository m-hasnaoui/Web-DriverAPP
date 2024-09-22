<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idC'])) {
        $query = "SELECT * FROM `3421` WHERE idC =:idC;";
        $params = array(':idC' => $_GET['idC']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM `3421`;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $nom_c = $_POST['nom_c'];
    $prenom_c = $_POST['prenom_c'];
    $ville = $_POST['ville'];
    $tell = $_POST['tell'];
    $active = $_POST['active'];
    
    $query = "INSERT INTO `3421`(nom_c, prenom_c, ville, tell, active) VALUES (:nom_c, :prenom_c, :ville, :tell, :active)";
    $params = array(':nom_c' => $nom_c,':prenom_c' => $prenom_c, ':ville' => $ville, ':tell' => $tell, ':active' => $active);
    $queryAutoIncrement = "SELECT MAX(idC) as idC FROM `3421`";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idC = $_GET['idC'];
    $nom_c = $_POST['nom_c'];
    $prenom_c = $_POST['prenom_c'];
    $ville = $_POST['ville'];
    $tell = $_POST['tell'];
    $active = $_POST['active'];

    $query = "UPDATE `3421` SET nom_c=:nom_c, prenom_c=:prenom_c, ville=:ville, tell=:tell, active=:active WHERE idC=:idC";
    $params = array(':idC' => $idC, ':nom_c' => $nom_c,':prenom_c' => $prenom_c,':ville' => $ville, ':tell' => $tell, ':active' => $active);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idC'];
    
    $query = "DELETE FROM `3421` WHERE idC = :idC";
    $params = array(':idC' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>

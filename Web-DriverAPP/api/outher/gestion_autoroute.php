<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idAM'])) {
        $query = "SELECT *FROM gestion_autoroute WHERE a.idAM = :idAM;";
        $params = array(':idAM' => $_GET['idAM']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT  *FROM gestion_autoroute";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idM = $_POST['idM'];
    $idAutoroute = $_POST['idAutoroute'];
    $chrage_solde = $_POST['chrage_solde'];
    $date_charging = $_POST['date_charging'];
    $num_cheque = $_POST['num_cheque'];
    $num_facture = $_POST['num_facture'];
    $operation = $_POST['operation'];

    // Construct the SQL query based on the value of 'operation'
    if ($operation == 'chargement') {
        $query = "INSERT INTO gestion_autoroute(idM, idAutoroute, chrage_solde, date_charging, num_cheque, num_facture, operation) VALUES (:idM, :idAutoroute, :chrage_solde, :date_charging, :num_cheque, :num_facture, :operation); UPDATE autoroute SET solde = (solde + :chrage_solde) WHERE idAutoroute = :idAutoroute";
    } elseif ($operation == 'consomation') {
        // Modify the query to include default values for num_cheque and num_facture
        $query = "INSERT INTO gestion_autoroute(idM, idAutoroute, chrage_solde, date_charging, num_cheque, num_facture, operation) VALUES (:idM, :idAutoroute, :chrage_solde, :date_charging, '_', '_', :operation); UPDATE autoroute SET solde = (solde - :chrage_solde) WHERE idAutoroute = :idAutoroute";
    } else {
        // Handle the case where 'operation' is neither 'chargement' nor 'consomation'
        // You might want to provide some error handling or fallback behavior here
        exit("Invalid operation");
    }

    // Prepare the parameters for the query
    $params = array(':idM' => $idM, ':idAutoroute' => $idAutoroute, ':chrage_solde' => $chrage_solde, ':date_charging' => $date_charging, ':num_cheque' => $num_cheque, ':num_facture' => $num_facture, ':operation' => $operation);

    // Execute the query
    $queryAutoIncrement = "SELECT MAX(idAM) as idAM FROM gestion_autoroute;";
    $result = metodPost($query, $queryAutoIncrement, $params);

    // Encode the result as JSON
    echo json_encode($result);

    // Send HTTP 200 OK header
    header("HTTP/1.1 200 OK");
    exit();
}


// if ($_POST['METHOD'] == 'PUT') {
//     unset($_POST['METHOD']);
//     $idAM = $_GET['idAM'];
//     $idAutoroute = $_POST['idAutoroute'];
//     // $chrage_solde = $_POST['chrage_solde'];
//     $date_charging = $_POST['date_charging'];
//     $idM = $_POST['idM'];
//       $num_cheque = $_POST['num_cheque'];
//     $num_facture = $_POST['num_facture'];
//     // $operation = $_POST['operation'];



//     $query = "UPDATE gestion_autoroute SET idAutoroute = :idAutoroute, date_charging = :date_charging ,idM=:idM WHERE idAM = :idAM;";
//     $params = array(':idAM' => $idAM, ':idAutoroute' => $idAutoroute, ':date_charging' => $date_charging,'idM'=>$idM);
//     $result = metodPut($query, $params);
//     echo json_encode($result);
//     header("HTTP/1.1 200 OK");
//     exit();
// }

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idAM = $_GET['idAM'];
    $chrage_solde = $_POST['chrage_solde'];
    $operation = $_POST['operation'];

    if ($operation == "chargement") {
        $query = "UPDATE autoroute SET solde = (solde - :chrage_solde) WHERE idAutoroute IN (SELECT idAutoroute FROM gestion_autoroute WHERE idAM = :idAM);";
    } elseif ($operation == "consomation") {
        $query = "UPDATE autoroute SET solde = (solde + :chrage_solde) WHERE idAutoroute IN (SELECT idAutoroute FROM gestion_autoroute WHERE idAM = :idAM);";
    } else {
        // Handle invalid operation
        echo json_encode(array("error" => "Invalid operation"));
        exit();
    }

    // Add deletion query for gestion_autoroute table
    $query .= "DELETE FROM gestion_autoroute WHERE idAM = :idAM;";

    $params = array(':idAM' => $idAM, ':chrage_solde' => $chrage_solde);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}



header("HTTP/1.1 400 Bad Request");
?>

<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');


function encodeImage($image) {
    return base64_encode($image);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idDriver'])) {
        $query = "SELECT idFile, idDriver, permis, cin, rib, document FROM uploadfile WHERE idDriver = :idDriver;";
        $params = array(':idDriver' => $_GET['idDriver']);
        $result = metodGet($query, $params);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        // Encode the BLOB data to base64
        foreach ($data as &$row) {
            if (isset($row['permis'])) {
                $row['permis'] = base64_encode($row['permis']);
            }
            if (isset($row['cin'])) {
                $row['cin'] = base64_encode($row['cin']);
            }
            if (isset($row['rib'])) {
                $row['rib'] = base64_encode($row['rib']);
            }
            if (isset($row['document'])) {
                $row['document'] = base64_encode($row['document']);
            }
        }
        echo json_encode($data);
    } else {
        $query = "SELECT idFile, idDriver, permis, cin, rib, document FROM uploadfile";
        $result = metodGet($query);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        // Encode the BLOB data to base64
        foreach ($data as &$row) {
            if (isset($row['permis'])) {
                $row['permis'] = base64_encode($row['permis']);
            }
            if (isset($row['cin'])) {
                $row['cin'] = base64_encode($row['cin']);
            }
            if (isset($row['rib'])) {
                $row['rib'] = base64_encode($row['rib']);
            }
            if (isset($row['document'])) {
                $row['document'] = base64_encode($row['document']);
            }
        }
        echo json_encode($data);
    }
    // header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idDriver = $_POST['idDriver'];
    $permis = isset($_FILES['permis']) && $_FILES['permis']['error'] == 0 ? file_get_contents($_FILES['permis']['tmp_name']) : null;
    $cin = isset($_FILES['cin']) && $_FILES['cin']['error'] == 0 ? file_get_contents($_FILES['cin']['tmp_name']) : null;
    $rib = isset($_FILES['rib']) && $_FILES['rib']['error'] == 0 ? file_get_contents($_FILES['rib']['tmp_name']) : null;
    $document = isset($_FILES['document']) && $_FILES['document']['error'] == 0 ? file_get_contents($_FILES['document']['tmp_name']) : null;
    $idUser=$_POST['idUser'];
    $query = "INSERT INTO uploadfile (idDriver, permis, cin, rib, document, idUser) VALUES (:idDriver, :permis, :cin, :rib, :document, :idUser)";
    $params = array(
        ':idDriver' => $idDriver,
        ':permis' => $permis,
        ':cin' => $cin,
        ':rib' => $rib,
        ':document' => $document,
        ':idUser' => $idUser, // Make sure $idUser is defined and obtained correctly
    );

    try {
        $queryAutoIncrement = "SELECT MAX(idFile) as idFile FROM uploadfile;";
        $result = metodPost($query, $queryAutoIncrement, $params);
        echo json_encode($result);
        header("HTTP/1.1 200 OK");
    } catch (Exception $e) {
        echo json_encode(array('error' => $e->getMessage()));
        header("HTTP/1.1 500 Internal Server Error");
    }
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idDriver = $_GET['idDriver'];

    // Initialize query parts
    $queryParts = [];
    $params = array(':idDriver' => $idDriver);

    if (isset($_FILES['permis']) && $_FILES['permis']['error'] == 0) {
        $permis = file_get_contents($_FILES['permis']['tmp_name']);
        $queryParts[] = "permis=:permis";
        $params[':permis'] = $permis;
    }

    if (isset($_FILES['cin']) && $_FILES['cin']['error'] == 0) {
        $cin = file_get_contents($_FILES['cin']['tmp_name']);
        $queryParts[] = "cin=:cin";
        $params[':cin'] = $cin;
    }

    if (isset($_FILES['rib']) && $_FILES['rib']['error'] == 0) {
        $rib = file_get_contents($_FILES['rib']['tmp_name']);
        $queryParts[] = "rib=:rib";
        $params[':rib'] = $rib;
    }

    if (isset($_FILES['document']) && $_FILES['document']['error'] == 0) {
        $document = file_get_contents($_FILES['document']['tmp_name']);
        $queryParts[] = "document=:document";
        $params[':document'] = $document;
    }

    // Build the query dynamically based on provided fields
    if (!empty($queryParts)) {
        $query = "UPDATE uploadfile SET " . implode(', ', $queryParts) . " WHERE idDriver=:idDriver;";
        $result = metodPut($query, $params);
        echo json_encode($result);
        header("HTTP/1.1 200 OK");
    } else {
        // No files provided, handle error or do nothing
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['error' => 'No files provided for update']);
    }

    exit();
}


// if ($_POST['METHOD'] == 'DELETE') {
//     unset($_POST['METHOD']);
//     $idAutoroute = $_GET['idAutoroute'];
//     $query = "DELETE FROM uploadfile WHERE idAutoroute = :idAutoroute;";
//     $params = array(':idAutoroute' => $idAutoroute);
//     $result = metodDelete($query, $params);
//     echo json_encode($result);
//     header("HTTP/1.1 200 OK");
//     exit();
// }

header("HTTP/1.1 400 Bad Request");

?>

<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Function to encode image to base64
function encodeImage($image) {
    return base64_encode($image);
}

// GET request
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idDriver'])) {
        $query = "SELECT  driver.idDriver,  driver.nom,  driver.prenom,  driver.address,  driver.tell,  driver.image,  driver.dispo,  driver.active,  driver.date_c,  driver.ste,  driver.date_embauche,  driver.sf,  driver.numE,  driver.numCin,  driver.date_obtention_permis, driver.date_fin_permis,  driver.date_fin_cin,  driver.valide_cin,  driver.date_naissance,  driver.lieu_naissance,  driver.date_derniere_visite_medicale,  driver.num_carte_driver_pro,  driver.date_fin_driver_pro,  driver.Num_CNSS,  driver.type_contrat,  driver.date_fin_FCD,  driver.numRib,  driver.code_banque,  driver.agence_bancaire,  driver.remarque_sortie,u.username FROM driver join users u on driver.idUser=u.idUser  WHERE idDriver = :idDriver;";
        $params = array(':idDriver' => $_GET['idDriver']);
        $result = metodGet($query, $params);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        // Encode the image data to base64
        foreach ($data as &$row) {
            if (isset($row['image'])) {
                $row['image'] = encodeImage($row['image']);
            }
        }
        echo json_encode($data);
    } else {
        $query = "SELECT driver.idDriver,  driver.nom,  driver.prenom,  driver.address,  driver.tell,  driver.image,  driver.dispo,  driver.active,  driver.date_c,  driver.ste,  driver.date_embauche,  driver.sf,  driver.numE,  driver.numCin,  driver.date_obtention_permis, driver.date_fin_permis,  driver.date_fin_cin,  driver.valide_cin,  driver.date_naissance,  driver.lieu_naissance,  driver.date_derniere_visite_medicale,  driver.num_carte_driver_pro,  driver.date_fin_driver_pro,  driver.Num_CNSS,  driver.type_contrat,  driver.date_fin_FCD,  driver.numRib,  driver.code_banque,  driver.agence_bancaire,  driver.remarque_sortie,u.username  FROM driver join users u on driver.idUser=u.idUser";
        $result = metodGet($query);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        // Encode the image data to base64
        foreach ($data as &$row) {
            if (isset($row['image'])) {
                $row['image'] = encodeImage($row['image']);
            }
        }
        echo json_encode($data);
    }
    
    // header("HTTP/1.1 200 OK");
    exit();
}

// POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['METHOD']) && $_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $address = $_POST['address'];
    $tell = $_POST['tell'];
    $dispo = $_POST['dispo'];
    $active = $_POST['active'];
    $ste = $_POST['ste'];
    $date_embauche = $_POST['date_embauche'];
    $sf = $_POST['sf'];
    $numE = $_POST['numE'];
    $numCin = $_POST['numCin'];
    $date_obtention_permis = $_POST['date_obtention_permis'];
    $date_fin_permis = $_POST['date_fin_permis'];
    $date_fin_cin = $_POST['date_fin_cin'];
    $valide_cin = $_POST['valide_cin'];
    $date_naissance = $_POST['date_naissance'];
    $lieu_naissance = $_POST['lieu_naissance'];
    $date_derniere_visite_medicale = $_POST['date_derniere_visite_medicale'];
    $num_carte_driver_pro = $_POST['num_carte_driver_pro'];
    $date_fin_driver_pro = $_POST['date_fin_driver_pro'];
    $Num_CNSS = $_POST['Num_CNSS'];
    $type_contrat = $_POST['type_contrat'];
    $date_fin_FCD = $_POST['date_fin_FCD'];
    $numRib = $_POST['numRib'];
    $code_banque = $_POST['code_banque'];
    $agence_bancaire = $_POST['agence_bancaire'];
    $remarque_sortie = $_POST['remarque_sortie'];
    $idUser = $_POST['idUser'];

    // Handle file upload for image
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $image = file_get_contents($_FILES['image']['tmp_name']);
    } else {
        $image = null;
    }

    $query = "INSERT INTO driver(nom, prenom, address, tell, image, dispo, active, ste, date_embauche, sf, numE, numCin, date_obtention_permis, date_fin_permis, date_fin_cin, valide_cin, date_naissance, lieu_naissance, date_derniere_visite_medicale, num_carte_driver_pro, date_fin_driver_pro, Num_CNSS, type_contrat, date_fin_FCD, numRib, code_banque, agence_bancaire, remarque_sortie, idUser) 
              VALUES (:nom, :prenom, :address, :tell, :image, :dispo, :active, :ste, :date_embauche, :sf, :numE, :numCin, :date_obtention_permis, :date_fin_permis, :date_fin_cin, :valide_cin, :date_naissance, :lieu_naissance, :date_derniere_visite_medicale, :num_carte_driver_pro, :date_fin_driver_pro, :Num_CNSS, :type_contrat, :date_fin_FCD, :numRib, :code_banque, :agence_bancaire, :remarque_sortie, :idUser)";
    $params = array(
        ':nom' => $nom,
        ':prenom' => $prenom,
        ':address' => $address,
        ':tell' => $tell,
        ':image' => $image,
        ':dispo' => $dispo,
        ':active' => $active,
        ':ste' => $ste,
        ':date_embauche' => $date_embauche,
        ':sf' => $sf,
        ':numE' => $numE,
        ':numCin' => $numCin,
        ':date_obtention_permis' => $date_obtention_permis,
        ':date_fin_permis' => $date_fin_permis,
        ':date_fin_cin' => $date_fin_cin,
        ':valide_cin' => $valide_cin,
        ':date_naissance' => $date_naissance,
        ':lieu_naissance' => $lieu_naissance,
        ':date_derniere_visite_medicale' => $date_derniere_visite_medicale,
        ':num_carte_driver_pro' => $num_carte_driver_pro,
        ':date_fin_driver_pro' => $date_fin_driver_pro,
        ':Num_CNSS' => $Num_CNSS,
        ':type_contrat' => $type_contrat,
        ':date_fin_FCD' => $date_fin_FCD,
        ':numRib' => $numRib,
        ':code_banque' => $code_banque,
        ':agence_bancaire' => $agence_bancaire,
        ':remarque_sortie' => $remarque_sortie,
        ':idUser' => $idUser
    );
    $queryAutoIncrement = "SELECT MAX(idDriver) as idDriver FROM driver;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 201 Created");
    exit();
}

// PUT request
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['METHOD']) && $_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idDriver = $_GET['idDriver'];

    // Sanitize and retrieve POST data
    $fields = [
        'nom', 'prenom', 'address', 'tell', 'dispo', 'active', 'ste', 
        'date_embauche', 'sf', 'numE', 'numCin', 'date_obtention_permis', 
        'date_fin_permis', 'date_fin_cin', 'valide_cin', 'date_naissance', 
        'lieu_naissance', 'date_derniere_visite_medicale', 'num_carte_driver_pro', 
        'date_fin_driver_pro', 'Num_CNSS', 'type_contrat', 'date_fin_FCD', 
        'numRib', 'code_banque', 'agence_bancaire', 'remarque_sortie'
    ];

    $params = [':idDriver' => $idDriver];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            $params[":$field"] = $_POST[$field];
        }
    }

    // Handle image upload
    $updateImage = false;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $image = file_get_contents($_FILES['image']['tmp_name']);
        $params[':image'] = $image;
        $updateImage = true;
    }

    // Build the query parts
    $queryParts = [];
    foreach ($params as $key => $value) {
        if ($key != ':idDriver') {
            $queryParts[] = substr($key, 1) . "=$key";
        }
    }

    // If there is an image to update, include it in the query
    if ($updateImage) {
        $queryParts[] = "image=:image";
    } else {
        unset($params[':image']); // Remove image from params if not updating
    }

    // Build the full query
    $query = "UPDATE driver SET " . implode(", ", $queryParts) . " WHERE idDriver=:idDriver";

    // Execute the query
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


// DELETE request
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['METHOD']) && $_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idDriver'];
    
    // Check if idDriver exists in the Driver table
    $checkQuery = "SELECT COUNT(*) AS count FROM driver WHERE idDriver = :idDriver";
    $checkParams = array(':idDriver' => $id);
    $checkResult = metodGet($checkQuery, $checkParams);
    $rowCount = $checkResult->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($rowCount == 0) {
        // If idDriver doesn't exist, return an error response
        $response = array('message' => 'Driver not found');
        http_response_code(404); // Set HTTP status code to 404 (Not Found)
        echo json_encode($response);
        exit();
    }
    
    // Check if the driver is associated with any other table
    $query = "SELECT CASE WHEN EXISTS (SELECT 1 FROM association_vd WHERE idDriver = :idDriver) THEN TRUE ELSE FALSE END AS result";
    $params = array(':idDriver' => $id);
    $result = metodGet($query, $params);
    $checkResult = $result->fetch(PDO::FETCH_ASSOC);
    
    if ($checkResult['result'] == 0) {
        // Deletion allowed, execute DELETE query
        $deleteQuery = "DELETE FROM driver WHERE idDriver = :idDriver";
        $deleteParams = array(':idDriver' => $id);
        $deleteResult = metodDelete($deleteQuery, $deleteParams);
        
        $response = array('message' => 'Deletion successful');
        http_response_code(200); // Set HTTP status code to 200 (OK)
    } else {
        $response = array('message' => 'Deletion not allowed');
        http_response_code(400); // Set HTTP status code to 400 (Bad Request)
    }
    
    // Send response
    echo json_encode($response);
    exit();
}

// If the request method is not supported
header("HTTP/1.1 400 Bad Request");

?>
<?php
$pdo=null;
$host="";
$user="";
$pass="";
$bd="";

function connect(){
    try{
        $GLOBALS['pdo']=new PDO("mysql:host=".$GLOBALS['host'].";dbname=".$GLOBALS['bd']."", $GLOBALS['user'], $GLOBALS['pass']);
        $GLOBALS['pdo']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }catch (PDOException $e){
        print "Error!: No connect a  bd ".$bd."<br/>";
        print "\nError!: ".$e."<br/>";
        die();
    }
}

function disconnect() {
    $GLOBALS['pdo']=null;
}

function metodGet($query, $params = array()){
    try{
        connect();
        $statement=$GLOBALS['pdo']->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute($params);
        disconnect();
        return $statement;
    }catch(Exception $e){
        die("Error: ".$e);
    }
}

function metodPost($query, $queryAutoIncrement, $params){
    try{
        connect();
        $statement = $GLOBALS['pdo']->prepare($query);
        $statement->execute($params);
        $idAutoIncrement = metodGet($queryAutoIncrement)->fetch(PDO::FETCH_ASSOC);
        $result = array_merge($idAutoIncrement, $_POST);
        $statement->closeCursor();
        disconnect();
        return $result;
    }catch(Exception $e){
        die("Error POST: ".$e->getMessage());
    }
}

function metodPut($query, $params){
    try{
        connect();
        $statement=$GLOBALS['pdo']->prepare($query);
        $statement->execute($params);
        $result=array_merge($_GET, $_POST);
        $statement->closeCursor();
        disconnect();
        return $result;
    }catch(Exception $e){
        die("Error: ".$e);
    }
}

function metodDelete($query, $params){
    try{
        connect();
        $statement=$GLOBALS['pdo']->prepare($query);
        $statement->execute($params);
        $statement->closeCursor();
        disconnect();
        return $_GET['id'];
    }catch(Exception $e){
        die("Error: ".$e);
    }
}

?>
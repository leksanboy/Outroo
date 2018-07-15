<?php include "../db.php";
	$id = $_GET['id'];
	
	$sql = "SELECT id 
			FROM z_notifications 
			WHERE receiver = $id AND is_deleted = 0 AND status = 0";
	$result = $conn->query($sql);

	echo $result->num_rows;
	
	$conn->close();
?>

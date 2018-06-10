<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $data['user'];
	$id = $data['id'];

	$sql = "INSERT INTO z_photos_replays (user, photo, ip_address)
			VALUES ($user, $id, '$ipAddress')";
	$result = $conn->query($sql);
	$conn->close();
?>
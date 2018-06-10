<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $data['sender'];
	$visitor = $data['receiver'];

	$sql = "INSERT INTO z_users_replays (user, visitor, ip_address)
			VALUES ($user, $visitor, '$ipAddress')";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));
	$conn->close();
?>
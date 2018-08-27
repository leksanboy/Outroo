<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$type = $data['type'];
	$user = $data['user'];
	$receiver = $data['receiver'];

	if ($type == "mark") { // Add
		$sql = "INSERT INTO z_bookmarks (user, post, ip_address)
				VALUES ($user, $id, '$ipAddress')";
		$result = $conn->query($sql);
		
		var_dump(http_response_code(204));
		$conn->close();
	} else if ($type == "unmark") { // Remove
		$sql = "DELETE FROM z_bookmarks
				WHERE user = $user AND post = $id";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));
		
		$conn->close();
	}
?>

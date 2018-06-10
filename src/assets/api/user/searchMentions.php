<?php include "../db.php";
	$caption = $_GET['caption'];
	$cuantity = $_GET['cuantity'];

	$sql = "SELECT id
			FROM z_users
			WHERE name LIKE '%$caption%' OR username LIKE '%$caption%'
			ORDER by username ASC, name ASC
			LIMIT $cuantity";
	$result = $conn->query($sql);

	$data = array();
	while($row = $result->fetch_assoc()) {
		$row['user'] = userUsernameNameAvatar($row['id']);
		$data[] = $row;
	}

	echo json_encode($data);
	$conn->close();
?>

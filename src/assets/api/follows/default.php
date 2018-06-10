<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$type = $_GET['type'];
	$session = $_GET['session'];
	$user = $_GET['user'];

	if ($more == 0)
		$user = userId($user);

	if ($type == 'following') {
		$sql = "SELECT u.id, u.official, u.private 
				FROM z_following f 
					INNER JOIN z_users u ON f.receiver = u.id 
				WHERE f.sender = $user 
					AND f.is_deleted = 0 
				ORDER by u.username ASC 
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['id']);
			$row['status'] = checkFollowingStatus($session, $row['id']);
			$row['official'] = $row['official'] ? true : false;
			$row['private'] = $row['private'] ? true : false;
			$data[] = $row;
		}

		echo json_encode($data);
		$conn->close();
	} else if ($type == 'followers') {
		$sql = "SELECT u.id, u.official, u.private 
				FROM z_following f 
					INNER JOIN z_users u ON f.sender = u.id 
				WHERE f.receiver = $user 
					AND f.is_deleted = 0 
					AND f.status = 0 
				ORDER by u.username ASC 
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['id']);
			$row['status'] = checkFollowingStatus($session, $row['id']);
			$row['official'] = $row['official'] ? true : false;
			$row['private'] = $row['private'] ? true : false;
			$data[] = $row;
		}

		echo json_encode($data);
		$conn->close();
	}
?>

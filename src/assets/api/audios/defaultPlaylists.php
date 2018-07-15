<?php include "../db.php";
	$user = userId($_GET['user']);
	$session = $_GET['session'];
	$type = $_GET['type'];

	// Playlists for list or combo
	if ($type == 'default')
		$id = $user;
	else if ($type == 'session')
		$id = $session;

	// Get data
	$sql = "SELECT id, title, image, private
			FROM z_audios_playlist
			WHERE user = $id AND is_deleted = 0 
			ORDER BY date DESC";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['private'] = $row['private'] ? true : false;
			$row['idPlaylist'] = $row['id'];
			
			if ($session == $user)
				$data[] = $row;
			else
				if (!$row['private'])
					$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>

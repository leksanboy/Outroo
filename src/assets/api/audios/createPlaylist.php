<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$id = $data['id'];
	$user = $data['user'];
	$type = $data['type'];
	$subtype = $data['subtype'];
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$title = $data['title'];
	$image = $data['image'];
	$imageName = '';

	if ($image) {
		$imageName = generateRandomString(23);
		$imageNameJpg = $imageName.'.jpg';
		$imagePath = '/var/www/html/assets/media/audios/covers/'.$imageNameJpg;
		$image = explode(',', $image);
		$image = str_replace(' ', '+', $image[1]);
		$image = base64_decode($image);
		file_put_contents($imagePath, $image);
	}

	if ($type == 'create') {
		$sql = "INSERT INTO z_audios_playlist (user, title, image, ip_address)
				VALUES ($user, '$title', '$imageNameJpg', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		$inserted = getPlaylist($insertedId);
		echo json_encode($inserted);
		
		$conn->close();
	} else if ($type == 'update') {
		if ($subtype == 'updateTitle') {
			$sql = "UPDATE z_audios_playlist
					SET title = '$title', ip_address = '$ipAddress' 
					WHERE id = $id AND user = $user";
			$result = $conn->query($sql);

			$inserted = getPlaylist($id);
			echo json_encode($inserted);
			
			$conn->close();
		} else if ($subtype == 'updateTitleImage') {
			$sql = "UPDATE z_audios_playlist
					SET title = '$title', image = '', ip_address = '$ipAddress' 
					WHERE id = $id AND user = $user";
			$result = $conn->query($sql);

			$inserted = getPlaylist($id);
			echo json_encode($inserted);
			
			$conn->close();
		} else if ($subtype == 'updateNewImage') {
			$sql = "UPDATE z_audios_playlist
					SET title = '$title', image = '$imageNameJpg', ip_address = '$ipAddress' 
					WHERE id = $id AND user = $user";
			$result = $conn->query($sql);

			$inserted = getPlaylist($id);
			echo json_encode($inserted);
			
			$conn->close();
		}
	}
?>

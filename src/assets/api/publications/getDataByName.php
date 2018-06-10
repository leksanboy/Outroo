<?php include "../db.php";
	$name = $_GET['name'];

	$sql = "SELECT id, user, name, content, photos, audios, disabled_comments, date 
			FROM z_publications 
			WHERE name = '$name' AND is_deleted = 0";
	$result = $conn->query($sql)->fetch_assoc();

	if ($result['id']){
		$result['countComments'] = countCommentsPublication($result['id']);
		$result['countLikes'] = countLikesPublication($result['id']);
		$result['disabledComments'] = ($result['disabled_comments'] == 0) ? true : false;
		$result['comments'] = [];

		$result['photos'] = json_decode($result['photos']);
		foreach ($result['photos'] as &$p) {
			$p = getPhotoData($p);
		}

		$result['audios'] = json_decode($result['audios']);
		foreach ($result['audios'] as &$a) {
			$a = getAudioData($a);
		}

		$data = array(
			'user' => userUsernameNameAvatar($result['user']),
			'data' => $result
		);

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>

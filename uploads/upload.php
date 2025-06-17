<?php
header('Content-Type: application/json');

$target_dir = __DIR__ . "/";
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($_FILES["paymentProof"]["name"], PATHINFO_EXTENSION));
$new_file_name = uniqid() . "." . $imageFileType;
$target_file = $target_dir . $new_file_name;

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["paymentProof"]["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        echo json_encode(["success" => false, "message" => "File is not an image."]);
        $uploadOk = 0;
    }
}

// Check file size (e.g., 5MB limit)
if ($_FILES["paymentProof"]["size"] > 5000000) {
    echo json_encode(["success" => false, "message" => "Sorry, your file is too large."]);
    $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" && $imageFileType != "webp" ) {
    echo json_encode(["success" => false, "message" => "Sorry, only JPG, JPEG, PNG, WEBP & GIF files are allowed."]);
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    // nothing to do here, error message already sent
} else {
    if (move_uploaded_file($_FILES["paymentProof"]["tmp_name"], $target_file)) {
        // Assuming your website is hosted at the root or similar, construct public URL
        // You might need to adjust this path based on your actual Afeexhost setup
        $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $public_path = "/uploads/" . $new_file_name; // Adjust if your site is in a subdirectory
        echo json_encode(["success" => true, "url" => $base_url . $public_path]);
    } else {
        echo json_encode(["success" => false, "message" => "Sorry, there was an error uploading your file."]);
    }
}
?> 
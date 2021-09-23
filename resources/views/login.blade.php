<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gistr 2.0</title>
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="text-center p-20">
        <div class="max-w-md mx-auto mb-8">
            <img src="{{ asset('images/jetpacktocat.png') }}" alt="">
        </div>
        <a href="{{ route('auth' )}}" class="text-white text-xl bg-black hover:bg-blue-500 transition-colors duration-300 rounded-sm py-4 px-16 inline-block mx-auto">
            Login
            <span class="hidden sm:inline">with GitHub<span>
        </a>
    </div>
</body>
</html>

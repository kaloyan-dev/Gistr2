<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gistr 2.1</title>
    <meta name="name" content="{{ $user->name }}">
    <meta name="username" content="{{ $user->username }}">
    <meta name="avatar" content="{{ $user->avatar }}">
    <meta name="anonymous" content="{{ asset('images/anonymous.png') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    @vite('resources/css/app.css')
</head>
<body class="overflow-y-scroll h-full min-h-full bg-gray-100">
    <div id="app" class="h-full"></div>
    @viteReactRefresh
    @vite('resources/js/index.tsx')
</body>
</html>

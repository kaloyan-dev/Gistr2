<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gistr 2.1</title>
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    @vite('resources/css/app.css')
</head>

<body>
    <div class="text-center md:p-20">
        <div class="max-w-md mx-auto mb-8">
            <img src="{{ asset('images/jetpacktocat.png') }}" alt="">
        </div>
        <a href="{{ route('auth') }}"
            class="text-white text-xl bg-black hover:bg-blue-500 transition-colors duration-300 rounded-sm py-4 px-16 inline-block mx-auto">
            <span class="inline-block relative pl-7">
                <span class="absolute top-1/2 left-0 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" data-slot="icon" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                </span>
                Login
            </span>
            <span class="hidden sm:inline">with GitHub<span>
        </a>
    </div>
</body>

</html>

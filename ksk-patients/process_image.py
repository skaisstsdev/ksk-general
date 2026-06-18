import sys
try:
    from rembg import remove
    from PIL import Image
    import io

    input_path = 'landing-intensivpflege/img/hero-new.jpg'
    output_path = 'landing-intensivpflege/img/hero-new-bg-removed.png'

    with open(input_path, 'rb') as i:
        input_data = i.read()
    
    # remove background
    output_data = remove(input_data)
    
    with open(output_path, 'wb') as o:
        o.write(output_data)

    print("Background removed successfully")
except Exception as e:
    print(f"Error: {e}")

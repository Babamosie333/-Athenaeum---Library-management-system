import { useEffect, useRef } from "react";
import * as THREE from "three";

// Ambient, low-opacity 3D background: slowly drifting book-like shapes.
// Tuned by device tier so it stays smooth on phones. Purely decorative —
// pointer-events are disabled so it never blocks clicks/scroll.
export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const bookCount = isMobile ? 10 : 22;
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Palette matched to the site theme (paper / forest green / soft gold)
    const colors = [0x3f5d45, 0x8a9a8e, 0xc9a86a, 0xe4e1d8];

    const geometry = new THREE.BoxGeometry(1.1, 1.5, 0.18); // book-like proportions
    const books = [];

    for (let i = 0; i < bookCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.7,
        metalness: 0.05,
        transparent: true,
        opacity: 0.16,
      });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10 - 4
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const scale = 0.6 + Math.random() * 0.9;
      mesh.scale.setScalar(scale);

      mesh.userData = {
        rotSpeed: (Math.random() - 0.5) * 0.003,
        floatSpeed: 0.15 + Math.random() * 0.25,
        floatOffset: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      };

      scene.add(mesh);
      books.push(mesh);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 8, 6);
    scene.add(ambient, dirLight);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile) window.addEventListener("mousemove", handleMouseMove);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      books.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotSpeed;
        mesh.rotation.y += mesh.userData.rotSpeed * 1.3;
        mesh.position.y = mesh.userData.baseY + Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.6;
      });

      // Gentle parallax toward cursor on desktop
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (!isMobile) window.removeEventListener("mousemove", handleMouseMove);
      geometry.dispose();
      books.forEach((mesh) => mesh.material.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}

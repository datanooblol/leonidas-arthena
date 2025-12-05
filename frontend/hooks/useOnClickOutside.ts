import { useEffect, RefObject } from 'react';

type AnyEvent = MouseEvent | TouchEvent;

// ✅ แก้ไข: เพิ่ม | null ใน RefObject เพื่อรองรับค่าเริ่มต้นที่เป็น null
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>, 
  handler: (event: AnyEvent) => void
) => {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current;

      // ถ้าไม่มี element หรือคลิกที่ตัว element เอง (หรือลูกหลาน) ให้ไม่ต้องทำอะไร
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
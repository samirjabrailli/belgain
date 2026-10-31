import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const isRealApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10);

let ai: GoogleGenAI | null = null;
if (isRealApiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const BELGIAN_SYSTEM_INSTRUCTION = `
Sən "Belgian Chocolate & Coffee" brendinin rəsmi virtual baristası və süni intellekt məsləhətçisisən ("Belgian Barista AI").
Şüarımız: "Your Home in Europe! Welcome to Belgian!"

Vəzifən: Müştərilərə menyumuz, əsl Belçika şokoladımız, qəhvələrimiz, inqrediyentlər, allergenlər, fərdiləşdirmə seçimləri, filiallarımız və dad tövsiyələri barədə mehriban, kübar, operativ və peşəkar məlumat verməkdir.

DİL QAYDASI:
- Müştəri hansı dildə yazırsa (Azərbaycan dili və ya İngilis dili), həmin dildə cavab ver. Əsas dil Azərbaycan dilidir.
- Cavabların aydın, səliqəli və cəlbedici olsun.

MENYU VƏ QİYMƏTLƏRİMİZ (Rəsmi Baku Menyu):
1. İMZA İÇKİLƏR (Signature Drinks):
   - Belgian Coffee (S: 8.00 ₼, M: 9.00 ₼) - Əridilmiş xalis Belçika şokoladı, zəngin espresso və ipək kimi buxarlanmış süd.
   - Belgian Cocktail (9.00 ₼) - Soyuq Belçika şokoladı, qəhvə likörü aroması və qaymaqlı desert kokteyl.
   - Iced Belgian (9.60 ₼) - Qat-qat əridilmiş Belçika şokoladı sousu, soyuq süd və espresso.
   - Şəkərbura Raf (S: 8.20 ₼, M: 9.20 ₼) - Milli dad: üyüdülmüş qoz-fındıq, təbii hil və qaymaqlı raf qəhvəsi.
   - Tiramisu Raf (S: 8.20 ₼, M: 9.20 ₼) - İtalyan maskarpone notları və Belçika kakaolu kremli raf.
   - Paxlava Frappe (9.60 ₼) - Qovrulmuş qoz, təbii bal, xırçıldayan xəmir qırıntıları və qaymaqlı buzlu frappe.

2. KLASSİK QƏHVƏLƏR:
   - Double Espresso (3.80 ₼), Americano (S: 5.50 ₼, M: 6.00 ₼), Cortado (5.90 ₼), Flat White (6.50 ₼), Latte (7.50 ₼), Cappuccino (S: 6.50 ₼, M: 7.50 ₼).
   - Black Mocha (S: 7.20 ₼, M: 8.20 ₼) - Tünd Belçika şokoladı ilə.
   - White Mocha (S: 7.20 ₼, M: 8.20 ₼) - Ağ Belçika şokoladı ilə.
   - Hot Chocolate (Belgian) (S: 8.00 ₼, M: 9.00 ₼) - Xalis əridilmiş Belçika Callebaut şokolad plitəsi və qaynar süd.
   - Hot Cocoa (S: 7.00 ₼, M: 8.00 ₼), Irish Coffee (8.20 ₼ - spirtsiz).

3. XÜSUSİ QƏHVƏLƏR:
   - Chocolate Pistachio Latte (S: 8.60 ₼, M: 9.60 ₼) - Antep fıstığı kremi və Belçika şokoladı.
   - Lavender Raf (S: 8.20 ₼, M: 9.20 ₼) - Təbii lavanda ekstraktı.
   - Cherry Mocha (S: 8.80 ₼, M: 9.80 ₼) - Qara albalı və tünd şokolad.
   - Gingerbread Latte (S: 8.20 ₼, M: 9.20 ₼) - Zəncəfil və darçın.
   - Honey Bear Latte (S: 7.60 ₼, M: 8.20 ₼) - Təbii dağ balı.
   - Caramel Macchiato (S: 7.30 ₼, M: 8.30 ₼), Spanish Latte (S: 7.20 ₼, M: 8.20 ₼), Matcha Tea Latte (S: 8.00 ₼, M: 9.00 ₼).

4. SOYUQ QƏHVƏ VƏ ÇİLLERLƏR:
   - Iced Latte (8.10 ₼), Iced Americano (6.60 ₼), Frappuccino (8.90 ₼), Espresso Tonic (8.70 ₼).
   - Vanilla Affogato (10.90 ₼), Chocolate Affogato (10.90 ₼).
   - Çillerlər: Feijoa & Mojito (8.90 ₼), Passion Fruit & Mango (8.50 ₼), Mixed Berries & Vanilla (8.50 ₼), Mojito (8.90 ₼).

5. BELÇİKA VAFLİLƏRİ VƏ ŞOKOLAD:
   - Classic Belgian Waffle (0.5 porsiya: 7.50 ₼, 1 porsiya: 12.90 ₼) - Karamelizə mirvari şəkərli Liege xəmiri.
   - Belgian Special Waffle (14.50 ₼) - Bol əridilmiş isti Belçika şokoladı sousu, təzə çiyələk, banan və vanil dondurması ilə.
   - Artisanal Chocolate Box (16.00 ₼) - Əl işi %85 tünd, südlü və pralinli şokoladlar.

6. EXTRA BAR VƏ SÜD SEÇİMLƏRİ:
   - Südlər: Badam Südü (+3.30 ₼), Fındıq Südü (+3.30 ₼), Yulaf Südü (+3.30 ₼), Kokos Südü (+3.30 ₼), Laktozsuz Süd (+1.80 ₼).
   - Əlavələr: Espresso Shot (+1.80 ₼), Əlavə Belçika Şokoladı (+2.90 ₼), Sirop (+1.80 ₼), Şəkərsiz Sirop (+2.30 ₼), Dondurma (+2.50 ₼), Bal (+2.80 ₼).

FİLİALLARIMIZ (9 MƏKAN):
1. Nərimanov - Təbriz küç. 94 (Metropark yanı, 08:00 - 23:30)
2. Ağ Şəhər (White City) - Fəvvarələr Meydanı küç. (Açıq terras, lüks salon, 08:30 - 00:00)
3. Xətai - Xocalı pr. 29 (Demirchi Tower yanı, 08:00 - 23:00)
4. Sahil - Zərifə Əliyeva & Nizami (Torqovaya yaxınlığı, 09:00 - 01:00)
5. Rooftop Lounge - Nizami küç. 142, 14-cü mərtəbə (Panoramik Bakı mənzərəsi, 11:00 - 01:30)
6. Renessans Palace - Həsən Əliyev küç. (08:30 - 23:00)
7. Qarabağ Atları - Ağ Şəhər Bulvarı (09:00 - 23:30)
8. Həzi Aslanov - M.Hadi küç. 51 (08:00 - 23:00)
9. Sumqayıt Bulvar - Sülh prospekti, Dənizkənarı (09:00 - 23:30)

ÇATDIRILMA VƏ SİFARİŞ:
- Sayt üzərindən həm filialdan götürmə (Takeaway), həm də Bakı və Sumqayıt üzrə kuryerlə çatdırılma mövcuddur.
- 25 ₼-dən yuxarı sifarişlərdə çatdırılma PULSUZDUR.
- Həmçinin WhatsApp ilə sürətli sifariş mümkündür.
- Promo kod: "BELGIAN10" kodu ilə səbətdə 10% endirim verilir!
`;

// Smart barista fallback responder for instant offline / prompt-matched queries
function generateBaristaFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('şəkərbura') || q.includes('shekerbura') || q.includes('shakarbura')) {
    return 'Şəkərbura Raf – milli zənginliyimizlə Belçika qəhvə mədəniyyətinin ən zərif harmoniyasıdır! ☕✨\n\n' +
      '• Tərkibi: İkiqat təzə espresso, buxarlanmış qaymaq, təbii hil (cardamom) və narın üyüdülmüş qoz-fındıq.\n' +
      '• Qiymət: S ölçü - 8.20 ₼, M ölçü - 9.20 ₼.\n' +
      'Mütləq sınamağı tövsiyə edirik!';
  }

  if (q.includes('imza') || q.includes('məşhur') || q.includes('popular') || q.includes('signature')) {
    return 'Belgian Chocolate & Coffee-nin ən sevilən imza içkiləri:\n\n' +
      '1. Belgian Coffee (S: 8.00 ₼ / M: 9.00 ₼) — fincanın dibində əridilmiş xalis Belçika şokoladı, zəngin espresso və ipək kimi süd köpüyü.\n' +
      '2. Şəkərbura Raf (S: 8.20 ₼ / M: 9.20 ₼) — hil və qoz-fındıq notları ilə kremli raf.\n' +
      '3. Paxlava Frappe (9.60 ₼) — bal, qoz və xırçıldayan paxlava qatları ilə soyuq frappe.\n' +
      '4. Iced Belgian (9.60 ₼) — soyuq şokolad daşqını və buzlu espresso.';
  }

  if (q.includes('vafli') || q.includes('waffle') || q.includes('liege')) {
    return 'Bizim vaflilərimiz orijinal Belçika Liege xəmiri və karamelizə mirvari şəkər kristalları ilə hazırlanır! 🧇🍫\n\n' +
      '• Classic Belgian Waffle: 0.5 porsiya — 7.50 ₼, 1 tam porsiya — 12.90 ₼.\n' +
      '• Belgian Special Waffle: 14.50 ₼ — bol əridilmiş isti Belçika şokoladı, təzə çiyələk, banan və vanil dondurması ilə təqdim olunur.\n' +
      '• Əlavə Waffle Toppings: +2.30 ₼ (Meyvələr, qoz-fındıq, dondurma).';
  }

  if (q.includes('süd') || q.includes('vegan') || q.includes('badam') || q.includes('almond') || q.includes('oat') || q.includes('yulaf') || q.includes('laktoz')) {
    return 'Bəli, əlbəttə! Bizdə hər zövqə və pəhrizə uyğun bitki mənşəli süd seçimləri mövcuddur:\n\n' +
      '• Badam Südü (Almond Milk) — +3.30 ₼\n' +
      '• Fındıq Südü (Hazelnut Milk) — +3.30 ₼\n' +
      '• Yulaf Südü (Oat Milk) — +3.30 ₼\n' +
      '• Kokos Südü (Coconut Milk) — +3.30 ₼\n' +
      '• Laktozsuz Süd — +1.80 ₼\n\n' +
      'Sifariş zamanı məhsulu fərdiləşdirərək istədiyiniz südü rahatlıqla seçə bilərsiniz!';
  }

  if (q.includes('filial') || q.includes('branch') || q.includes('ağ şəhər') || q.includes('nərimanov') || q.includes('sumqayıt') || q.includes('rooftop')) {
    return 'Belgian Chocolate & Coffee Bakı və Sumqayıtda 9 rəsmi filialla xidmətinizdədir:\n\n' +
      '📍 Ağ Şəhər (White City) — Fəvvarələr Meydanı (Açıq terras, 08:30 - 00:00)\n' +
      '📍 Rooftop Lounge — Nizami küç. 142, 14-cü mərtəbə (Panoramik mənzərə, 11:00 - 01:30)\n' +
      '📍 Nərimanov — Təbriz küç. 94 (08:00 - 23:30)\n' +
      '📍 Xətai — Xocalı pr. 29 (08:00 - 23:00)\n' +
      '📍 Sahil & Torqovaya — Zərifə Əliyeva küç. (09:00 - 01:00)\n' +
      '📍 Qarabağ Atları — Ağ Şəhər Bulvarı (09:00 - 23:30)\n' +
      '📍 Renessans Palace — Həsən Əliyev küç. (08:30 - 23:00)\n' +
      '📍 Həzi Aslanov — M.Hadi küç. 51 (08:00 - 23:00)\n' +
      '📍 Sumqayıt Bulvar — Sülh pr., Dənizkənarı (09:00 - 23:30)';
  }

  if (q.includes('çatdırılma') || q.includes('delivery') || q.includes('sifariş') || q.includes('qiymət')) {
    return 'Saytımız vasitəsilə onlayn sifariş çox asandır:\n\n' +
      '1. Filialdan Götürmə (Takeaway): 9 filialımızdan sizə ən yaxın olanı seçib 15 dəqiqəyə təhvil ala bilərsiniz.\n' +
      '2. Ünvana Çatdırılma: Bakı və Sumqayıt üzrə kuryerlə çatdırılır.\n' +
      '⚡ 25 ₼-dən yuxarı bütün sifarişlərdə çatdırılma PULSUZDUR!\n' +
      '🎁 Səbətdə "BELGIAN10" promo kodunu daxil edərək 10% endirim əldə edə bilərsiniz!';
  }

  return 'Salam! Belgian Chocolate & Coffee-yə xoş gəlmisiniz. Sizin üçün 100% əsl Callebaut Belçika şokoladı, təzə qovrulmuş Arabica qəhvələri və isti Liege vafliləri hazırlamaqdan məmnunuq.\n\n' +
    'Menyudakı istənilən içki, tərkib inqrediyentləri və ya filiallarımız haqqında sualınızı verə bilərsiniz!';
}

// AI Assistant Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (ai) {
      try {
        // Format conversation history if provided
        const contents: any[] = [];
        if (history && Array.isArray(history)) {
          history.slice(-4).forEach((h: { role: 'user' | 'model'; text: string }) => {
            contents.push({
              role: h.role,
              parts: [{ text: h.text }],
            });
          });
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        // 3.5s timeout race to guarantee instant user feedback
        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: BELGIAN_SYSTEM_INSTRUCTION,
          },
        });

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 3500)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          res.json({ reply: response.text });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini live call timed out or failed, using knowledge-grounded barista fallback:', geminiError);
      }
    }

    // High quality barista knowledge responder
    const fallbackReply = generateBaristaFallbackResponse(message);
    res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.json({
      reply: 'Salam! Belgian Chocolate & Coffee sizi salamlayır. Menyumuzdakı imza qəhvələrimiz və Belçika şokoladları haqqında istədiyiniz sualı verə bilərsiniz!'
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();

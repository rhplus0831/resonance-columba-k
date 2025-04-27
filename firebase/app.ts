import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { env } from "process";

// 에뮬레이터 호스트 환경 변수 확인
const firestoreEmulatorHost = env.FIRESTORE_EMULATOR_HOST; // 예: "localhost:8080" 또는 "127.0.0.1:8080"

let db: Firestore;
let adminApp: App;

if (!getApps().length) {
  let initOptions: any = {}; // 초기화 옵션 객체

  if (firestoreEmulatorHost) {
    console.log(`Firestore 에뮬레이터 감지됨: ${firestoreEmulatorHost}. 에뮬레이터에 연결합니다.`);
    // 에뮬레이터 사용 시: projectId만 필요 (실제 ID 또는 로컬용 ID)
    // credential은 제공하지 않음 (Admin SDK가 환경 변수를 보고 자동으로 처리)
    initOptions.projectId = env.FIREBASE_PROJECT_ID || "demo-local-project"; // 환경 변수가 없으면 로컬용 ID 사용
  } else {
    console.log("Firestore 에뮬레이터 환경 변수가 설정되지 않았습니다. 프로덕션 Firebase에 연결합니다.");
    // 프로덕션 또는 실제 Firebase 연결 시: 서비스 계정 사용
    const serviceAccount = {
      projectId: env.FIREBASE_PROJECT_ID,
      // 환경 변수에서 private key를 가져올 때 '\n' 처리가 필요할 수 있습니다.
      privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
    };

    // 프로덕션 환경에서는 필수 값들이 있는지 확인하는 것이 좋습니다.
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
      throw new Error("프로덕션 환경을 위한 Firebase Admin SDK 환경 변수(FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)가 설정되지 않았습니다.");
    }
    initOptions.credential = cert(serviceAccount);
  }

  // 앱 초기화
  adminApp = initializeApp(initOptions);
  db = getFirestore(adminApp);
  db.settings({ ignoreUndefinedProperties: true });
  console.log("Firestore 초기화 완료.");

} else {
  // 이미 초기화된 경우 기존 인스턴스 사용
  console.log("Firebase Admin 앱이 이미 초기화되었습니다.");
  adminApp = getApps()[0];
  db = getFirestore(adminApp);
}

// 컬렉션 참조 내보내기
// FIREBASE_COLLECTION_NAME 환경 변수가 없을 경우 기본값 또는 오류 처리 추가 권장
if (!env.FIREBASE_COLLECTION_NAME) {
    console.warn("경고: FIREBASE_COLLECTION_NAME 환경 변수가 설정되지 않았습니다.");
}
export const columbaCol = db.collection(env.FIREBASE_COLLECTION_NAME || "default_columba"); // 기본값 예시
export const playerConfigsCol = db.collection("playerConfigs");

// 필요하다면 db 인스턴스 자체를 내보낼 수도 있습니다.
// export { db };
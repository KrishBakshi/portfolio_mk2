import { getStaticPageMetadata } from "@/config/metadata";
import ProfileHeader from "@/components/sections/ProfileHeader";
import { PageCanvas } from "@/components/PageCanvas";
import { PROFILE } from "@/lib/llms";

export const metadata = getStaticPageMetadata("/");

export default function Home() {
  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background py-10 sm:py-16">
        <ProfileHeader
          name={PROFILE.name}
          title={PROFILE.title}
          profileImage={PROFILE.profileImage}
          bullets={[...PROFILE.bullets]}
          socialLinks={PROFILE.socialLinks}
        />
      </main>
    </PageCanvas>
  );
}

import Hero from '@/components/sections/Hero';
import Overview from '@/components/sections/Overview';
import HowItWorks from '@/components/sections/HowItWorks';
import ResearchResults from '@/components/sections/ResearchResults';
import DatasetSummary from '@/components/sections/DatasetSummary';
import Limitations from '@/components/sections/Limitations';

export default function LandingPage() {
  return <><Hero /><Overview /><HowItWorks /><ResearchResults /><DatasetSummary /><Limitations /></>;
}

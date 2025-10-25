-- Delete duplicate games, keeping only the first one from each pair
DELETE FROM public.games 
WHERE id IN (
  '02ed3747-4fd6-4b92-9a1d-7f945ba6289c',
  '9fbfdf74-3d56-4045-bfcd-cc771a4fe4ff',
  '5e06ddb8-293a-46c3-8ede-d66cf083e5ab',
  'af5bcf4a-9e38-4048-94e8-98c189b9443e',
  '3f2895ec-2531-4b1a-bfb6-351e04cd5714',
  '3fd6de0e-8894-4015-b52a-00f0ff7e3d69',
  '4827d5dc-554c-4917-9524-41150a4ba6ee',
  'c05d403a-4c33-43fe-9ead-c8203900b74d',
  '719d831f-e0c0-4e51-ad75-23233acbb568',
  '3fd5199f-4363-4e51-8e05-67e35ff3f72d',
  '9c00e2ea-34f8-497b-9254-3ec99e8a3727',
  'bb924694-0b27-42f6-8fb8-378f4b153946',
  '74970c07-e8ae-4951-bd2e-7b47aa60f91e',
  '41b823a5-47f7-40f9-83b8-3584595702a4',
  '6fe20580-9130-4d7d-910c-7ce8a0b81c60'
);

-- Add unique constraint to prevent duplicate games
-- A game is considered duplicate if it has the same host, sport, location, date, and start time
CREATE UNIQUE INDEX unique_game_per_slot 
ON public.games (host_id, sport, location_name, game_date, start_time);